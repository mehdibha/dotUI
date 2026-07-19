/**
 * GET /r/$name[?preset=…]
 *
 * Returns the resolved shadcn registry item for one dotui component. The
 * preset query param drives:
 *   - density selection (folded into class lists)
 *   - per-component enum-merge choices
 *   - scalar param values (rewritten inline into Tailwind suffixes)
 *   - enum-with-files choices (e.g. loader.style = "ring" → ship base.ring.tsx)
 *
 * `name` must match a generated publishable. Missing names return 404.
 */

import { createFileRoute } from '@tanstack/react-router'
import { format } from 'oxfmt'

import {
  publishables,
  PUBLISHABLE_NAMES,
} from '@/registry/__generated__/publishables'
import {
  publish,
  selectPublishable,
  setDotuiDepResolver,
  setKnownDotuiNames,
} from '@/publisher/publish'

// Prime the dep rewriter with every component name we ship. Lives at
// module scope so it runs once per route bundle load.
setKnownDotuiNames(PUBLISHABLE_NAMES)

import { resolveRequestPreset } from '@/lib/registry-preset'

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control':
    'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
}

// A fixed, conventional baseline — the consumer reformats with their own
// Prettier/Biome rules on commit, so formatting isn't a `codeOptions` axis.
// Only meant to keep the shipped + previewed source readable.
const OUTPUT_FORMAT = { printWidth: 80 } as const

export const Route = createFileRoute('/r/$name')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const name = params.name
        const loader = publishables[name]
        if (!loader) {
          return Response.json({ error: 'Not found' }, { status: 404 })
        }

        const url = new URL(request.url)
        const encodedPreset = url.searchParams.get('preset') ?? undefined
        const preset = await resolveRequestPreset(encodedPreset)

        // Configure how transitive deps get rewritten — they become absolute
        // URLs back at this same origin (with the preset preserved) so
        // `shadcn add` can follow them without a registry mapping in the
        // consumer's components.json.
        const origin = `${url.protocol}//${url.host}`
        const depQuery = encodedPreset ? `?preset=${encodedPreset}` : ''
        setDotuiDepResolver(origin, depQuery)

        const mod = await loader()
        const publishable = selectPublishable(mod, preset)

        const { item } = publish({ publishable, preset })

        // Run each file's source through oxfmt so the consumer's `shadcn add`
        // gets clean output. Format per-file — a base `.tsx` and a secondary
        // `.ts` hook carry different content and need their own parser. Don't
        // let formatter failures break the response — raw content still works.
        if (item.files) {
          item.files = (await Promise.all(
            item.files.map(async (file) => {
              try {
                const result = await format(
                  file.target ?? 'ui.tsx',
                  file.content ?? '',
                  OUTPUT_FORMAT,
                )
                return { ...file, content: result.code }
              } catch {
                return file
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
