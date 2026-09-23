/* `?preset=` resolution for the `/r/*` routes. The studio codec and resolver
   load lazily to stay out of the handlers' eager server graph. */

import type { PublishPreset } from "@/publisher/types"
import type { DecodeResult } from "@/modules/studio/preset/codec"

export type PresetFailure = Extract<DecodeResult, { ok: false }>["reason"]

export type RequestPreset =
  | { ok: true; preset: PublishPreset }
  | { ok: false; reason: PresetFailure }

/** An absent or empty param is the default system; anything else must decode. */
export async function resolveRequestPreset(
  encoded: string | undefined,
): Promise<RequestPreset> {
  const [{ decode, DEFAULT_PRESET }, { resolveDesignSystem }] =
    await Promise.all([
      import("@/modules/studio/preset/codec"),
      import("@/modules/studio/resolve"),
    ])
  const result = encoded
    ? decode(encoded)
    : { ok: true as const, ...DEFAULT_PRESET }
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
