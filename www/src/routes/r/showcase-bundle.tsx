/**
 * GET /r/showcase-bundle[?preset=…]
 *
 * Returns a single shadcn registry item that materializes a *whole project*
 * booting straight into the dotUI marketing showcase, themed to the caller's
 * preset. This is what the "Open in v0" button points at (via
 * `https://v0.dev/chat/api/open?url=<this>`).
 *
 * Why one fat item: v0 strips a registry item's `css` / `cssVars` fields and
 * doesn't reliably resolve `registryDependencies`, so the theme ships as a real
 * `globals.css`/`colors.css` file and every source file the showcase needs is
 * inlined in `files[]`. The transitive source + CSS closure is precomputed at
 * build time (`scripts/build-showcase-bundle.ts` →
 * `__generated__/showcase-bundle.ts`); only the preset-resolved `colors.css` and
 * the provider-seeded `page.tsx` are assembled per request.
 *
 * Files target a `src/`-rooted Next.js App Router project (the registry-starter
 * layout v0 scaffolds), so dotUI's `@/registry/*` imports resolve through the
 * `@/*` → `./src/*` alias with no rewriting.
 */

import { createFileRoute } from '@tanstack/react-router'

import { resolveRequestPreset } from '@/lib/registry-preset'
import {
  SHOWCASE_BUNDLE_CSS_FILES,
  SHOWCASE_BUNDLE_DEPENDENCIES,
  SHOWCASE_BUNDLE_SOURCE_FILES,
} from '@/registry/__generated__/showcase-bundle'
import { BUNDLE_GLOBALS_CSS, emitColorsCss } from '@/publisher/emit-bundle-css'
import type { PublishPreset } from '@/publisher/types'

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control':
    'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
}

interface ItemFile {
  type: string
  path: string
  target: string
  content: string
}

export const Route = createFileRoute('/r/showcase-bundle')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const encodedPreset = url.searchParams.get('preset') ?? undefined
        const preset = await resolveRequestPreset(encodedPreset)

        const files: ItemFile[] = [
          // App shell + theme (assembled per request). Root-relative targets:
          // v0 scaffolds a root-`app/` Next.js project with `@/*` → `./*`.
          file('registry:file', 'app/globals.css', BUNDLE_GLOBALS_CSS),
          file(
            'registry:file',
            'registry/base/colors.css',
            emitColorsCss(preset),
          ),
          file('registry:file', 'app/layout.tsx', buildLayoutTsx()),
          file('registry:page', 'app/page.tsx', buildPageTsx(preset)),
          // Mirrored theme CSS (base.css, theme.css, fonts.css, per-component styles.css, aggregator).
          ...SHOWCASE_BUNDLE_CSS_FILES.map((f) =>
            file('registry:file', f.target, f.content),
          ),
          // The transitive source closure (components, lib, hooks, provider, showcase cards).
          ...SHOWCASE_BUNDLE_SOURCE_FILES.map((f) =>
            file('registry:file', f.target, f.content),
          ),
        ]

        const item = {
          $schema: 'https://ui.shadcn.com/schema/registry-item.json',
          name: 'dotui-showcase',
          type: 'registry:block',
          title: 'dotUI Showcase',
          description:
            'The dotUI component showcase, themed to your design system preset.',
          dependencies: SHOWCASE_BUNDLE_DEPENDENCIES,
          registryDependencies: [],
          files,
        }

        return new Response(JSON.stringify(item, null, 2), {
          headers: JSON_HEADERS,
        })
      },
    },
  },
})

function file(type: string, target: string, content: string): ItemFile {
  return { type, path: target, target, content }
}

function buildLayoutTsx(): string {
  return `import type { ReactNode } from "react";

import "./globals.css";

export const metadata = {
\ttitle: "dotUI Showcase",
\tdescription: "A dotUI design system, themed to your preset.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
\treturn (
\t\t<html lang="en" suppressHydrationWarning>
\t\t\t<body className="bg-bg font-sans text-fg antialiased">{children}</body>
\t\t</html>
\t);
}
`
}

function buildPageTsx(preset: PublishPreset): string {
  const density = JSON.stringify(preset.density ?? 'default')
  const params = JSON.stringify(preset.componentParams ?? {})
  // Import the theme from the page too (not just the layout): if v0 keeps its
  // own root layout, the page still pulls in globals.css so the theme loads.
  return `"use client";

import "./globals.css";

import Cards from "../modules/marketing/cards";
import { DesignSystemProvider } from "../lib/styles";

export default function Page() {
\treturn (
\t\t<DesignSystemProvider density={${density}} params={${params}}>
\t\t\t<main className="min-h-screen bg-bg px-4 py-10 sm:px-8">
\t\t\t\t<div className="mx-auto max-w-7xl">
\t\t\t\t\t<Cards />
\t\t\t\t</div>
\t\t\t</main>
\t\t</DesignSystemProvider>
\t);
}
`
}
