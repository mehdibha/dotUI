import { type ReactNode, use, useCallback, useState } from "react"
import { getRouteApi } from "@tanstack/react-router"

import { DesignSystemProvider } from "@/lib/styles"
import {
  ExamplesIndex,
  GroupExamplesIndex,
} from "@/modules/create/__generated__/examples"
import { decodePreset } from "@/modules/create/preset/codec"
import { DEFAULTS } from "@/modules/create/preset/defaults"
import {
  useAnnouncePreviewReady,
  useIframeMessageListener,
} from "@/modules/create/preset/iframe-sync"
import type { DesignSystem } from "@/modules/create/preset/types"
import { PresetOverview } from "@/modules/create/preview/overview"

// Non-route file so the examples barrel, preset codec and overview stay in
// this route's split chunk instead of the router's critical import graph.
const promiseCache = new Map<
  string,
  Promise<{ default: React.ComponentType }>
>()

export function getExamplesPromise(slug: string) {
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

// Embedded, the preview sits inside the /create panel's rounded card; a native
// viewport scrollbar would cut into the card edge. Hide it — wheel/trackpad
// scrolling is unaffected. Standalone (open-in-new-tab) previews keep it.
const EMBEDDED_SCROLLBAR_CSS = `
html { scrollbar-width: none; }
html::-webkit-scrollbar { display: none; }
`

const route = getRouteApi("/preview/$slug")

export function PreviewPage() {
  const { slug } = route.useParams()
  const { preset } = route.useSearch()
  const [designSystem, setDesignSystem] = useState<DesignSystem>(() =>
    preset ? decodePreset(preset) : DEFAULTS,
  )

  useIframeMessageListener(
    useCallback((ds: DesignSystem) => setDesignSystem(ds), []),
  )

  // Declared above the `use()` below on purpose: a render that suspends never
  // commits, so this effect first runs once the example chunk has resolved.
  useAnnouncePreviewReady()

  // The "overview" slug isn't a component/group example — it's a bespoke style-guide
  // view that needs the raw designSystem (for the generated color ramps), so it's
  // rendered directly here rather than through the generated examples index.
  let content: ReactNode
  if (slug === "overview") {
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

  const embedded = typeof window !== "undefined" && window.self !== window.top

  return (
    <DesignSystemProvider
      params={designSystem.componentParams}
      tokens={designSystem.tokens}
      density={designSystem.density}
      color={designSystem.color}
      icons={designSystem.icons}
    >
      {embedded && <style>{EMBEDDED_SCROLLBAR_CSS}</style>}
      {content}
    </DesignSystemProvider>
  )
}
