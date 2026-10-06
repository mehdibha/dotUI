import { useCallback, useMemo, useState } from "react"
import { getRouteApi } from "@tanstack/react-router"

import { ensureFontStylesheets } from "@/lib/fonts"
import { DesignSystemProvider } from "@/lib/styles"
import { SearchIcon } from "@/registry/icons"
import { IconLibraryContext } from "@/registry/icons/create-icon"
import { iconLibraries } from "@/registry/icons/icon-map"
import type { IconLibraryName } from "@/registry/icons/icon-map"
import { ToastProvider } from "@/registry/ui/toast"
import {
  ExamplesIndex,
  GroupExamplesIndex,
} from "@/modules/studio/__generated__/examples"
import {
  useAnnouncePreviewReady,
  useDesignSystemMessages,
  usePreviewNavigationMessages,
  usePreviewWarmMessages,
} from "@/modules/studio/preset/iframe-sync"
import type { PreviewAssets } from "@/modules/studio/preset/iframe-sync"
import { shareDesignSystem } from "@/modules/studio/preset/share-design-system"
import type { DesignSystem } from "@/modules/studio/preset/types"
import { BlocksIndex } from "@/modules/studio/preview/blocks"
import { PreviewInspector } from "@/modules/studio/preview/inspector"
import { PresetOverview } from "@/modules/studio/preview/overview"
import { resolveDesignSystem } from "@/modules/studio/resolve"
import { getCurrent } from "@/modules/studio/selection"

// Non-route file so the examples barrel, workspace and overview stay in
// this route's split chunk instead of the router's critical import graph.
const promiseCache = new Map<
  string,
  Promise<{ default: React.ComponentType }>
>()

export function getExamplesPromise(slug: string) {
  let promise = promiseCache.get(slug)
  if (!promise) {
    // Block/group slugs share one namespace with component slugs and win the
    // lookup — e.g. the "cards" group resolves here before the "card" component.
    // A new block must not reuse a component's slug or it will silently shadow it.
    const load =
      BlocksIndex[slug] ?? GroupExamplesIndex[slug] ?? ExamplesIndex[slug]
    if (!load) return null
    promise = load()
    promiseCache.set(slug, promise)
  }
  return promise
}

// Embedded, the preview sits inside the /create panel's rounded card; a native
// viewport scrollbar would cut into the card edge. Hide it — wheel/trackpad
// scrolling is unaffected. Standalone (open-in-new-tab) previews keep it.
// Live previews (drags, hovers) skip transitions, or the preview trails them.
const EMBEDDED_CSS = `
html { scrollbar-width: none; }
html::-webkit-scrollbar { display: none; }
[data-studio-live] *, [data-studio-live] *::before, [data-studio-live] *::after { transition: none !important; }
`

const route = getRouteApi("/preview/$slug")

const LOADED_LIBRARIES = new Set<string>(
  iconLibraries
    .map((library) => library.name)
    .filter((name) => name !== "lucide"),
)

// One hidden icon per library loads its chunk before a preview needs it.
function WarmIcons({ libraries }: { libraries: IconLibraryName[] }) {
  return (
    <div hidden>
      {libraries.map((library) => (
        <IconLibraryContext.Provider key={library} value={library}>
          <SearchIcon />
        </IconLibraryContext.Provider>
      ))}
    </div>
  )
}

export function PreviewPage() {
  const { slug } = route.useParams()
  // Boots on the current design system (same origin, same storage); the
  // studio's messages take over from there.
  const [designSystem, setDesignSystem] = useState<DesignSystem>(() =>
    resolveDesignSystem(getCurrent().state),
  )

  const navigate = route.useNavigate()

  // What the studio is about to preview starts loading now.
  const [warmIcons, setWarmIcons] = useState<IconLibraryName[]>([])
  usePreviewWarmMessages(
    useCallback(({ fonts, icons }: PreviewAssets) => {
      if (fonts) ensureFontStylesheets(document, fonts)
      const added = (icons ?? []).filter((name) => LOADED_LIBRARIES.has(name))
      if (added.length)
        setWarmIcons((prev) => {
          const next = [...new Set([...prev, ...added])] as IconLibraryName[]
          return next.length === prev.length ? prev : next
        })
    }, []),
  )

  useDesignSystemMessages(
    useCallback(
      (next: DesignSystem) =>
        setDesignSystem((prev) => shareDesignSystem(prev, next)),
      [],
    ),
  )

  // The parent switches previews by navigating this document's own router — the
  // iframe never remounts, so the module cache and design-system state survive
  // and revisited previews render instantly. `replace` keeps these switches out
  // of the shared browsing history; the route loader keeps the current preview
  // on screen while a first-visit chunk loads.
  usePreviewNavigationMessages({
    onNavigate: useCallback(
      (next: string) => {
        if (next === slug) return
        void navigate({
          to: "/preview/$slug",
          params: { slug: next },
          search: (prev) => prev,
          replace: true,
        })
      },
      [slug, navigate],
    ),
    onPrefetch: useCallback((next: string) => {
      void getExamplesPromise(next)
    }, []),
  })

  // The route loader resolved the example chunk before this render, so this
  // effect runs with the previewed content committed.
  useAnnouncePreviewReady()

  const embedded = typeof window !== "undefined" && window.self !== window.top
  // Stable elements: a design-system change re-renders only what reads it.
  const chrome = useMemo(
    () => (
      <>
        {embedded && <style>{EMBEDDED_CSS}</style>}
        {embedded && <PreviewInspector />}
        {/* Inside the provider so toasts wear the previewed params; the app
            itself fires none. */}
        <ToastProvider />
      </>
    ),
    [embedded],
  )
  // The "overview" slug isn't a component/group example — it's a bespoke style-guide
  // view that needs the raw designSystem (for the generated color ramps), so it's
  // rendered directly here rather than through the generated examples index.
  const { Examples } = route.useLoaderData()
  const { color, tokens, density } = designSystem
  const overview = useMemo(
    () => <PresetOverview designSystem={{ color, tokens, density }} />,
    [color, tokens, density],
  )
  const examples = useMemo(() => Examples && <Examples />, [Examples])
  const content = slug === "overview" ? overview : examples
  if (!content) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-fg-muted">Preview not found</span>
      </div>
    )
  }

  return (
    <DesignSystemProvider
      params={designSystem.componentParams}
      tokens={tokens}
      density={density}
      color={color}
      icons={designSystem.icons}
    >
      {chrome}
      {content}
      {warmIcons.length > 0 && <WarmIcons libraries={warmIcons} />}
    </DesignSystemProvider>
  )
}
