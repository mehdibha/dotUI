import { createFileRoute } from '@tanstack/react-router'
import { createFromSource } from 'fumadocs-core/search/server'

import { docsSource } from '@/lib/source'

// Serves the full Orama search index (titles, descriptions, headings, and
// paragraph content from every docs page) as JSON. The search dialog fetches
// it once on first use and runs every query client-side — no request per
// keystroke. Built lazily on first request and cached at the edge.
const searchServer = createFromSource(docsSource)

export const Route = createFileRoute('/api/search')({
  server: {
    handlers: {
      GET: async () => {
        const response = await searchServer.staticGET()
        response.headers.set(
          'Cache-Control',
          'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
        )
        return response
      },
    },
  },
})
