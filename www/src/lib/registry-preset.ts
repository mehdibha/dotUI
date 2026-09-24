/**
 * Shared `?preset=` resolution for the `/r/*` registry routes.
 *
 * Each handler reads the compressed-base64url `preset` query param and turns it
 * into the publisher's `PublishPreset`. The studio codec and resolver are
 * imported lazily so they stay out of the route handlers' eager server graph.
 */

import type { PublishPreset } from "@/publisher/types"

export function defaultPreset(): PublishPreset {
  return { density: "default", componentParams: {} }
}

export interface RequestPreset {
  preset: PublishPreset
  /**
   * The param re-encoded canonically — the only form that may be echoed into
   * consumer files. `undefined` for the defaults or an undecodable value.
   */
  encodedPreset?: string
}

/**
 * Resolve a `?preset=` value to a `PublishPreset`, falling back to the default
 * preset when the param is absent or fails to decode.
 */
export async function resolveRequestPreset(
  raw: string | undefined,
): Promise<RequestPreset> {
  if (!raw) return { preset: defaultPreset() }
  try {
    const [{ decodePreset, encodePreset }, { resolveDesignSystem }] =
      await Promise.all([
        import("@/modules/studio/preset/codec"),
        import("@/modules/studio/resolve"),
      ])
    const decoded = decodePreset(raw)
    const ds = resolveDesignSystem(decoded.state)
    return {
      preset: {
        color: ds.color,
        density: ds.density,
        componentParams: ds.componentParams,
        tokens: ds.tokens,
        codeOptions: decoded.codeOptions,
        icons: ds.icons,
      },
      encodedPreset: encodePreset(decoded),
    }
  } catch {
    return { preset: defaultPreset() }
  }
}
