/**
 * Shared `?preset=` resolution for the `/r/*` registry routes.
 *
 * Each handler reads the compressed-base64url `preset` query param and turns it
 * into the publisher's `PublishPreset`. The studio codec and resolver are
 * imported lazily so they stay out of the route handlers' eager server graph.
 */

import type { PublishPreset } from "@/publisher/types"
import type { StateIssue } from "@/modules/studio/axes"

export function defaultPreset(): PublishPreset {
  return { density: "default", componentParams: {} }
}

export type RequestPreset =
  | { ok: true; preset: PublishPreset }
  | { ok: false; issues: StateIssue[] }

/** Resolve a `?preset=` value; absent means the default preset. */
export async function resolveRequestPreset(
  encoded: string | undefined,
): Promise<RequestPreset> {
  if (!encoded) return { ok: true, preset: defaultPreset() }
  const [{ decodePreset }, { resolveDesignSystem }] = await Promise.all([
    import("@/modules/studio/preset/codec"),
    import("@/modules/studio/resolve"),
  ])
  const decoded = decodePreset(encoded)
  if (!decoded.ok) return decoded
  const ds = resolveDesignSystem(decoded.preset.state)
  return {
    ok: true,
    preset: {
      color: ds.color,
      density: ds.density,
      componentParams: ds.componentParams,
      tokens: ds.tokens,
      codeOptions: decoded.preset.codeOptions,
      icons: ds.icons,
    },
  }
}

export function invalidPresetResponse(issues: StateIssue[]): Response {
  return Response.json(
    { error: "Invalid preset", issues },
    { status: 400, headers: { "Cache-Control": "no-store" } },
  )
}
