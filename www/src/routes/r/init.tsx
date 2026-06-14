/**
 * GET /r/init[?preset=…]
 *
 * Returns the `registry:base` item that `npx shadcn init <this-url>` consumes.
 * The preset query param (compressed base64url) bakes into the consumer's
 * `components.json` so `shadcn add @dotui/<name>` requests hit the matching
 * /r/$name endpoint with the same preset attached.
 */

import { createFileRoute } from '@tanstack/react-router'
import { format } from 'oxfmt'

import { baseRegistryCss } from '@/registry/__generated__/base-css'
import { DEFAULT_CODE_OPTIONS } from '@/publisher/code-options'
import { emitInitItem } from '@/publisher/emit-theme'
import { codeOptionsToFormatConfig } from '@/publisher/format-config'
import type { PublishPreset } from '@/publisher/types'

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control':
    'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
}

export const Route = createFileRoute('/r/init')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const encodedPreset = url.searchParams.get('preset') ?? undefined
        const preset = encodedPreset
          ? await decodePresetForRoute(encodedPreset)
          : defaultPreset()

        const item = emitInitItem({
          baseRegistryCss,
          preset,
          encodedPreset,
          registryRoot: `${url.protocol}//${url.host}`,
        })

        // Format the shipped `cn` helper in the user's chosen code style so the
        // utils file matches the components they install. Best-effort.
        const codeOptions = preset.codeOptions ?? DEFAULT_CODE_OPTIONS
        if (item.files) {
          item.files = (await Promise.all(
            item.files.map(async (f) => {
              if (!f.content) return f
              try {
                const result = await format(
                  f.target ?? f.path ?? 'utils.ts',
                  f.content,
                  codeOptionsToFormatConfig(codeOptions),
                )
                return { ...f, content: result.code }
              } catch {
                return f
              }
            }),
          )) as typeof item.files
        }

        return new Response(JSON.stringify(item, null, 2), {
          headers: JSON_HEADERS,
        })
      },
    },
  },
})

function defaultPreset(): PublishPreset {
  return { density: 'compact', componentParams: {} }
}

async function decodePresetForRoute(encoded: string): Promise<PublishPreset> {
  try {
    const { decodePreset } = await import('@/modules/create/preset/codec')
    const ds = decodePreset(encoded)
    return {
      color: ds.color,
      density: ds.density,
      componentParams: ds.componentParams,
      codeOptions: ds.codeOptions,
    }
  } catch {
    return defaultPreset()
  }
}
