/* The "Open in v0" item: a whole Next.js project — every published component,
   the theme baked into `app/globals.css`, a small demo card — assembled from
   the same publisher output `/r/<name>.json` serves. See `@/publisher/emit-v0`. */

import { format } from "oxfmt"

import { baseRegistryCss } from "@/registry/__generated__/base-css"
import { publishables } from "@/registry/__generated__/publishables"
import type { RegistryItem } from "@/registry/types"
import { mergePresetCssFields } from "@/publisher/emit-theme"
import { buildV0Item } from "@/publisher/emit-v0"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

export async function v0Item(
  preset: PublishPreset,
): Promise<Record<string, unknown>> {
  const items = await Promise.all(
    Object.values(publishables).map(async (loader) => {
      const mod = await loader()
      return publish({ publishable: selectPublishable(mod, preset), preset })
        .item
    }),
  )

  const item = buildV0Item({
    items,
    cssFields: mergePresetCssFields(baseRegistryCss, preset, {
      googleFontsImport: true,
    }),
  })

  // Users read this code in v0: format the TS files. A formatter failure keeps
  // the raw content.
  item.files = await Promise.all(
    (item.files as RegistryItem["files"])!.map(async (file) => {
      if (!/\.(tsx?)$/.test(file.target ?? "")) return file
      try {
        const result = await format(file.target!, file.content ?? "", {
          printWidth: 80,
        })
        return { ...file, content: result.code }
      } catch {
        return file
      }
    }),
  )
  return item
}
