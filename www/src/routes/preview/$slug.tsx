import { type ReactNode, use, useCallback, useEffect, useState } from 'react'
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

/* ---- dev-tweak scaffolding (remove once picked) ----
   Scrollbar mode driven from the create page's tweaker via localStorage (key
   duplicated from preview-panel.tsx); cross-document storage events make it live. */
const DEV_SCROLLBAR_TWEAK_KEY = 'dotui:dev-preview-scrollbar'
type DevScrollbarMode = 'custom' | 'auto-hide' | 'none' | 'native'
const DEV_TWEAKS_ENABLED =
  import.meta.env.DEV || import.meta.env.VERCEL_ENV === 'preview'

const DEV_SCROLLBAR_CSS: Record<DevScrollbarMode, string> = {
  custom: EMBEDDED_SCROLLBAR_CSS,
  // Custom below-toolbar track, but invisible at rest — the thumb shows only while
  // scrolling (data attr set below) or hovered, mimicking macOS overlay behavior.
  'auto-hide': `${EMBEDDED_SCROLLBAR_CSS}
html:not([data-dev-scrolling])::-webkit-scrollbar-thumb { background-color: transparent; }
html:not([data-dev-scrolling])::-webkit-scrollbar-thumb:hover {
  background-color: color-mix(in oklab, var(--color-fg) 45%, transparent);
}
`,
  none: `
html { scrollbar-width: none; }
html::-webkit-scrollbar { display: none; }
`,
  native: '',
}

function useDevScrollbarMode(): DevScrollbarMode {
  const [mode, setMode] = useState<DevScrollbarMode>('custom')

  useEffect(() => {
    if (!DEV_TWEAKS_ENABLED) return
    const read = () => {
      const stored = localStorage.getItem(DEV_SCROLLBAR_TWEAK_KEY)
      setMode(
        stored && stored in DEV_SCROLLBAR_CSS
          ? (stored as DevScrollbarMode)
          : 'custom',
      )
    }
    read()
    window.addEventListener('storage', read)
    return () => window.removeEventListener('storage', read)
  }, [])

  // auto-hide: flag the root while scrolling so the thumb shows only then.
  useEffect(() => {
    if (mode !== 'auto-hide') return
    let timer: ReturnType<typeof setTimeout>
    const onScroll = () => {
      document.documentElement.setAttribute('data-dev-scrolling', '')
      clearTimeout(timer)
      timer = setTimeout(
        () => document.documentElement.removeAttribute('data-dev-scrolling'),
        800,
      )
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      document.documentElement.removeAttribute('data-dev-scrolling')
    }
  }, [mode])

  return mode
}
/* ---- end dev-tweak scaffolding ---- */

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
  const devScrollbarMode = useDevScrollbarMode()

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
      {embedded && DEV_SCROLLBAR_CSS[devScrollbarMode] && (
        <style>{DEV_SCROLLBAR_CSS[devScrollbarMode]}</style>
      )}
      <div className={embedded ? 'pt-11' : undefined}>{content}</div>
    </DesignSystemProvider>
  )
}
