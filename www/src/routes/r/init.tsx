/**
 * GET /r/init[?preset=…]
 *
 * Returns the `registry:base` item that `npx shadcn init <this-url>` consumes.
 * The preset query param (compressed base64url) bakes into the consumer's
 * `components.json` so `shadcn add @dotui/<name>` requests hit the matching
 * /r/$name endpoint with the same preset attached.
 */

import { createFileRoute } from '@tanstack/react-router'

import { resolveRequestPreset } from '@/lib/registry-preset'
import { baseRegistryCss } from '@/registry/__generated__/base-css'
import { emitInitItem } from '@/publisher/emit-theme'

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
        const preset = await resolveRequestPreset(encodedPreset)

        const item = emitInitItem({
          baseRegistryCss,
          preset,
          encodedPreset,
          registryRoot: `${url.protocol}//${url.host}`,
        })

        return new Response(JSON.stringify(item, null, 2), {
          headers: JSON_HEADERS,
        })
      },
    },
  },
})
