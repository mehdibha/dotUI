/* The "Open in v0" item: a whole Next.js project — every published component,
   the theme baked into `app/globals.css`, a small demo card — assembled from
   the same publisher output `/r/<name>.json` serves. See `@/publisher/emit-v0`. */

import { format } from "oxfmt"

import { baseRegistryCss } from "@/registry/__generated__/base-css"
import { publishables } from "@/registry/__generated__/publishables"
import useImageLoadingStatusSource from "@/registry/hooks/use-image-loading-status.ts?raw"
import useMobileSource from "@/registry/hooks/use-mobile.ts?raw"
import contextSource from "@/registry/lib/context/index.tsx?raw"
import textareaCaretSource from "@/registry/lib/textarea-caret/index.ts?raw"
import utilsSource from "@/registry/lib/utils/index.ts?raw"
import type { RegistryItem } from "@/registry/types"
import { mergePresetCssFields } from "@/publisher/emit-theme"
import { buildV0Item, rewriteRegistryImports } from "@/publisher/emit-v0"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

/**
 * Registry support modules shipped straight from source. Published component
 * files import these via `@/hooks/*` / `@/lib/*`, but most metas don't ship
 * them as secondary files; any that do win over these (dedupe by target).
 */
const SUPPORT_FILES: Record<string, string> = Object.fromEntries(
  Object.entries({
    "lib/utils.ts": utilsSource,
    "lib/context.tsx": contextSource,
    "lib/textarea-caret.ts": textareaCaretSource,
    "hooks/use-image-loading-status.ts": useImageLoadingStatusSource,
    "hooks/use-mobile.ts": useMobileSource,
  }).map(([target, source]) => [target, rewriteRegistryImports(source)]),
)

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
    supportFiles: SUPPORT_FILES,
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
