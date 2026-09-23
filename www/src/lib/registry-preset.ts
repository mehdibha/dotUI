/* `?preset=` resolution for the `/r/*` routes. The studio codec and resolver
   load lazily to stay out of the handlers' eager server graph. */

import type { PublishPreset } from "@/publisher/types"
import type { DecodeResult } from "@/modules/studio/preset/codec"

export type PresetFailure = Extract<DecodeResult, { ok: false }>["reason"]

export type RequestPreset =
  | { ok: true; preset: PublishPreset }
  | { ok: false; reason: PresetFailure }

export function defaultPreset(): PublishPreset {
  return { density: "default", componentParams: {} }
}

/** An absent or empty param is the default preset; anything else must decode. */
export async function resolveRequestPreset(
  encoded: string | undefined,
): Promise<RequestPreset> {
  if (!encoded) return { ok: true, preset: defaultPreset() }
  const [{ decode }, { resolveDesignSystem }] = await Promise.all([
    import("@/modules/studio/preset/codec"),
    import("@/modules/studio/resolve"),
  ])
  const result = decode(encoded)
  if (!result.ok) return result
  const ds = resolveDesignSystem(result.state)
  return {
    ok: true,
    preset: {
      color: ds.color,
      density: ds.density,
      componentParams: ds.componentParams,
      tokens: ds.tokens,
      codeOptions: result.codeOptions,
      icons: ds.icons,
    },
  }
}
