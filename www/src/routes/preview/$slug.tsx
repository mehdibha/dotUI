import { type ReactNode, use, useCallback, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { DesignSystemProvider } from '@/lib/styles'
import {
  ExamplesIndex,
  GroupExamplesIndex,
} from '@/modules/create/__generated__/examples'
import {
  DEFAULTS,
  decodePreset,
  useIframeMessageListener,
  useReportPreviewScrolled,
} from '@/modules/create/preset'
import type { DesignSystem } from '@/modules/create/preset'
import { PresetOverview } from '@/modules/create/preview/overview'

const promiseCache = new Map<
  string,
  Promise<{ default: React.ComponentType }>
>()

function getExamplesPromise(slug: string) {
  let promise = promiseCache.get(slug)
  if (!promise) {
    // Group/block slugs share one namespace with component slugs and win the
    // lookup — e.g. the "cards" block resolves here before the "card" component.
    // A new block must not reuse a component's slug or it will silently shadow it.
    const load = GroupExamplesIndex[slug] ?? ExamplesIndex[slug]
    if (!load) return null
    promise = load()
    promiseCache.set(slug, promise)
  }
  return promise
}

// Embedded, the /create toolbar overlays the top 3.5rem of the viewport; the native
// viewport scrollbar would run beneath it and get caught in its blur. Styling the
// scrollbar (WebKit classic mode) lets the track start below the toolbar via a
// margin, so the thumb only ever travels in the visible area. Firefox has no track
// margin — it falls back to a thin full-height scrollbar.
const EMBEDDED_SCROLLBAR_CSS = `
html::-webkit-scrollbar { width: 10px; }
html::-webkit-scrollbar-track { margin-block-start: 3.5rem; }
html::-webkit-scrollbar-thumb {
  background-color: color-mix(in oklab, var(--color-fg) 28%, transparent);
  background-clip: padding-box;
  border: 3px solid transparent;
  border-radius: 999px;
}
html::-webkit-scrollbar-thumb:hover {
  background-color: color-mix(in oklab, var(--color-fg) 45%, transparent);
}
@supports not selector(::-webkit-scrollbar) {
  html {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in oklab, var(--color-fg) 35%, transparent) transparent;
  }
}
`

export const Route = createFileRoute('/preview/$slug')({
  validateSearch: z.object({ preset: z.string().optional().catch(undefined) }),
  ssr: false,
  beforeLoad: ({ params }) => {
    getExamplesPromise(params.slug)
  },
  component: PreviewPage,
})

function PreviewPage() {
  const { slug } = Route.useParams()
  const { preset } = Route.useSearch()
  const [designSystem, setDesignSystem] = useState<DesignSystem>(() =>
    preset ? decodePreset(preset) : DEFAULTS,
  )

  useIframeMessageListener(
    useCallback((ds: DesignSystem) => setDesignSystem(ds), []),
  )
  useReportPreviewScrolled()

  // The "overview" slug isn't a component/group example — it's a bespoke style-guide
  // view that needs the raw designSystem (for the generated color ramps), so it's
  // rendered directly here rather than through the generated examples index.
  let content: ReactNode
  if (slug === 'overview') {
    content = <PresetOverview designSystem={designSystem} />
  } else {
    const promise = getExamplesPromise(slug)
    if (!promise) {
      return (
        <div className="flex h-screen items-center justify-center">
          <span className="text-fg-muted">Preview not found</span>
        </div>
      )
    }
    const { default: Examples } = use(promise)
    content = <Examples />
  }

  // Embedded in the /create builder, the preview renders under a translucent toolbar the
  // height of the app header. Offset the content so it clears the toolbar at rest while
  // still sliding under it on scroll: header height (3.5rem) minus the toolbar's own
  // padding (px-3, 0.75rem) = 2.75rem / pt-11. Opened standalone (open-in-new-tab) there
  // is no toolbar, so no offset.
  const embedded = typeof window !== 'undefined' && window.self !== window.top

  return (
    <DesignSystemProvider
      params={designSystem.componentParams}
      tokens={designSystem.tokens}
      density={designSystem.density}
      color={designSystem.color}
      icons={designSystem.icons}
    >
      {embedded && <style>{EMBEDDED_SCROLLBAR_CSS}</style>}
      <div className={embedded ? 'pt-11' : undefined}>{content}</div>
    </DesignSystemProvider>
  )
}
