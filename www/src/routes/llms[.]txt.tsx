import { createFileRoute } from '@tanstack/react-router'

import { siteConfig } from '@/config/site'
import { docsSource } from '@/lib/source'

// Serves /llms.txt — the llmstxt.org index: an H1, a blockquote summary, then
// H2 sections of `[name](url): description` links. The component list is
// generated from the docs source so it can never drift from the docs tree as
// components are added or removed. Served dynamically by the serverless function
// (cached at the edge via the Cache-Control header below).
//
// Spec: https://llmstxt.org/
// Returned as text/plain; charset=utf-8 — the spec's recommendation and the most
// broadly compatible content type for this file.

const SUMMARY = `dotUI is a design system platform and component registry built on React Aria Components, Tailwind CSS 4, and TypeScript 5. Generate a branded UI library in minutes with the style editor, then consume it through the shadcn CLI, the registry endpoint (${siteConfig.url}/r/{name}), or AI tooling like v0. Append .md to any docs URL for its raw markdown, or read ${siteConfig.url}/llms-full.txt for the entire documentation in a single file.`

type DocLink = { url: string; data: { title?: string; description?: string } }

function formatList(pages: DocLink[]): string[] {
  return pages
    .slice()
    .sort((a, b) => a.url.localeCompare(b.url))
    .map((page) => {
      const title = page.data.title ?? page.url
      const description = page.data.description
        ? `: ${page.data.description}`
        : ''
      return `- [${title}](${siteConfig.url}${page.url})${description}`
    })
}

export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () => {
        const docs = docsSource.getPages()
        // The components overview lives at /docs/components (no trailing slash);
        // individual component pages live beneath it.
        const isComponent = (url: string) =>
          url === '/docs/components' || url.startsWith('/docs/components/')
        const gettingStarted = docs.filter((page) => !isComponent(page.url))
        const components = docs.filter((page) => isComponent(page.url))

        const body =
          [
            '# dotUI',
            '',
            `> ${SUMMARY}`,
            '',
            '## Overview',
            '',
            ...formatList(gettingStarted),
            '',
            '## Components',
            '',
            ...formatList(components),
          ].join('\n') + '\n'

        return new Response(body, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control':
              'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
          },
        })
      },
    },
  },
})
