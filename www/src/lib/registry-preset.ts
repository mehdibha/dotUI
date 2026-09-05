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

/**
 * Resolve a `?preset=` value to a `PublishPreset`, falling back to the default
 * preset when the param is absent or fails to decode.
 */
export async function resolveRequestPreset(
  encoded: string | undefined,
): Promise<PublishPreset> {
  if (!encoded) return defaultPreset()
  try {
    const [{ decodePreset }, { resolveDesignSystem }] = await Promise.all([
      import("@/modules/create/preset/codec"),
      import("@/modules/studio/resolve"),
    ])
    const preset = decodePreset(encoded)
    const ds = resolveDesignSystem(preset.state)
    return {
      color: ds.color,
      density: ds.density,
      componentParams: ds.componentParams,
      tokens: ds.tokens,
      codeOptions: preset.codeOptions,
      icons: ds.icons,
    }
  } catch {
    return defaultPreset()
  }
}
