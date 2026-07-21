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
// viewport scrollbar would run beneath it and get caught in its blur, and a styled
// (classic-mode) scrollbar can't match the native overlay look. Hide it instead —
// wheel/trackpad scrolling is unaffected. Standalone (open-in-new-tab) previews
// keep the native scrollbar.
const EMBEDDED_SCROLLBAR_CSS = `
html { scrollbar-width: none; }
html::-webkit-scrollbar { display: none; }
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
