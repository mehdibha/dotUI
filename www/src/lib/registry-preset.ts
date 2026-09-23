/* Preset resolution for the `/r/*` routes. The studio codec and resolver
   load lazily to stay out of the handlers' eager server graph. */

import type { PublishPreset } from "@/publisher/types"
import type { DecodeResult } from "@/modules/studio/preset/codec"

export type PresetFailure = Extract<DecodeResult, { ok: false }>["reason"]

export type RequestPreset =
  | {
      ok: true
      preset: PublishPreset
      /** The canonical, rev-pinned query that dependency URLs and
       *  components.json carry. */
      query: string
    }
  | { ok: false; reason: PresetFailure }

/** No params is Origin's latest revision; anything given must decode. */
export async function resolveRequestPreset(
  search: URLSearchParams,
): Promise<RequestPreset> {
  const [{ decode, encodeQuery, readParams }, { resolveDesignSystem }] =
    await Promise.all([
      import("@/modules/studio/preset/codec"),
      import("@/modules/studio/resolve"),
    ])
  const result = decode(readParams(search))
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
    query: encodeQuery(result, result.base),
  }
}
