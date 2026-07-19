/**
 * GET /r/v0[?preset=…]
 *
 * Returns a single registry item that materializes a whole Next.js project —
 * every published dotUI component, the preset's theme baked into a real
 * `app/globals.css`, and a small demo card — for the "Open in v0" button
 * (`https://v0.dev/chat/api/open?url=<this>`).
 *
 * Assembled per request from the same publisher output `/r/$name` serves;
 * see `@/publisher/emit-v0` for the why and the item shape.
 */

import { createFileRoute } from '@tanstack/react-router'
import { format } from 'oxfmt'

import { resolveRequestPreset } from '@/lib/registry-preset'
import { baseRegistryCss } from '@/registry/__generated__/base-css'
import { publishables } from '@/registry/__generated__/publishables'
import useImageLoadingStatusSource from '@/registry/hooks/use-image-loading-status.ts?raw'
import useMobileSource from '@/registry/hooks/use-mobile.ts?raw'
import contextSource from '@/registry/lib/context/index.tsx?raw'
import textareaCaretSource from '@/registry/lib/textarea-caret/index.ts?raw'
import utilsSource from '@/registry/lib/utils/index.ts?raw'
import type { RegistryItem } from '@/registry/types'
import { mergePresetCssFields } from '@/publisher/emit-theme'
import { buildV0Item, rewriteRegistryImports } from '@/publisher/emit-v0'
import { publish, selectPublishable } from '@/publisher/publish'

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control':
    'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
}

/**
 * Registry support modules shipped straight from source. Published component
 * files import these via `@/hooks/*` / `@/lib/*`, but most metas don't ship
 * them as secondary files; any that do win over these (dedupe by target).
 */
const SUPPORT_FILES: Record<string, string> = Object.fromEntries(
  Object.entries({
    'lib/utils.ts': utilsSource,
    'lib/context.tsx': contextSource,
    'lib/textarea-caret.ts': textareaCaretSource,
    'hooks/use-image-loading-status.ts': useImageLoadingStatusSource,
    'hooks/use-mobile.ts': useMobileSource,
  }).map(([target, source]) => [target, rewriteRegistryImports(source)]),
)

export const Route = createFileRoute('/r/v0')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const encodedPreset = url.searchParams.get('preset') ?? undefined
        const preset = await resolveRequestPreset(encodedPreset)

        const items = await Promise.all(
          Object.values(publishables).map(async (loader) => {
            const mod = await loader()
            const publishable = selectPublishable(mod, preset)
            return publish({ publishable, preset }).item
          }),
        )

        const item = buildV0Item({
          items,
          cssFields: mergePresetCssFields(baseRegistryCss, preset),
          supportFiles: SUPPORT_FILES,
        })

        // Same courtesy as /r/$name: users read this code in v0, so run the
        // TS files through oxfmt. Formatter failures keep the raw content.
        item.files = await Promise.all(
          (item.files as RegistryItem['files'])!.map(async (file) => {
            if (!/\.(tsx?)$/.test(file.target ?? '')) return file
            try {
              const result = await format(file.target!, file.content ?? '', {
                printWidth: 80,
              })
              return { ...file, content: result.code }
            } catch {
              return file
            }
          }),
        )

        return new Response(JSON.stringify(item, null, 2), {
          headers: JSON_HEADERS,
        })
      },
    },
  },
})
