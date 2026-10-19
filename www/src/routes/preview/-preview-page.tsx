import { Activity, useEffect, useMemo, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { getRouteApi, useRouterState } from "@tanstack/react-router"

import { loadFontFaces } from "@/lib/fonts"
import { DesignSystemProvider } from "@/lib/styles"
import { SearchIcon } from "@/registry/icons"
import { IconLibraryContext } from "@/registry/icons/create-icon"
import { iconLibraries } from "@/registry/icons/icon-map"
import type { IconLibraryName } from "@/registry/icons/icon-map"
import { cn } from "@/registry/lib/utils"
import { Loader } from "@/registry/ui/loader"
import { ToastProvider } from "@/registry/ui/toast"
import { ExamplesIndex } from "@/modules/studio/__generated__/examples"
import {
  isInIframe,
  useAnnouncePreviewReady,
  useAppliedDesignSystem,
  useMessage,
} from "@/modules/studio/preset/iframe-sync"
import type {
  PrepareDesignSystem,
  PreviewBoard,
} from "@/modules/studio/preset/iframe-sync"
import { BlocksIndex } from "@/modules/studio/preview/blocks"
import { boardOf } from "@/modules/studio/preview/boards"
import { BoardFocusProvider } from "@/modules/studio/preview/boards/board"
import { PreviewInspector } from "@/modules/studio/preview/inspector"
import { PresetOverview } from "@/modules/studio/preview/overview"
import {
  requestThemeCss,
  themeCssNow,
} from "@/modules/studio/preview/theme-css-worker"
import { designSystemOf, internDesignSystem } from "@/modules/studio/resolve"
import { getCurrent } from "@/modules/studio/selection"

// Non-route file so the examples barrel, workspace and overview stay in
// this route's split chunk instead of the router's critical import graph.
const promiseCache = new Map<
  string,
  Promise<{ default: React.ComponentType }>
>()

const loadCards = () =>
  import("@/components/showcase/cards-grid").then((m) => ({
    default: m.CardsCanvas,
  }))

export function getExamplesPromise(slug: string) {
  let promise = promiseCache.get(slug)
  if (!promise) {
    // Block slugs share one namespace with component slugs and win the lookup.
    // A new block must not reuse a component's slug or it will silently shadow it.
    const load =
      boardOf(slug) ??
      BlocksIndex[slug] ??
      (slug === "cards" ? loadCards : undefined) ??
      ExamplesIndex[slug]
    if (!load) return null
    promise = load()
    promiseCache.set(slug, promise)
  }
  return promise
}

// Embedded, the preview sits inside the /studio panel's rounded card; a native
// viewport scrollbar would cut into the card edge. Hide it — wheel/trackpad
// scrolling is unaffected. Standalone (open-in-new-tab) previews keep it.
// Overscroll bounces the preview itself, not the whole studio.
// Live previews (drags, hovers) skip transitions, or the preview trails them.
const EMBEDDED_CSS = `
html { scrollbar-width: none; overscroll-behavior: contain; }
html::-webkit-scrollbar { display: none; }
[data-studio-live] *, [data-studio-live] *::before, [data-studio-live] *::after { transition: none !important; }
`

// Dev tweaker exploration (the board's swap): trim to the pick once Mehdi
// chooses. "slide" is the panel's drill-in: the old view goes at once and the
// new one fades in from 24px off, so it animates the new content alone.
// "slide-fade" and "crossfade" also fade the old view out, which takes a view
// transition: its capture restyles the whole preview before anything moves.
const slideFrom = (x: number) => [
  { opacity: 0, transform: `translateX(${x}px)` },
  { opacity: 1, transform: "none" },
]

// The site keeps :root out of view transitions (styles.css), so the stage
// takes part under its own name. Its animations go in CSS: Chrome ends a
// transition whose pseudo-elements only have script animations still pending.
// Their own <style>, as a variable on <html> would restyle the whole preview.
let swapStyle: HTMLStyleElement | undefined
const SWAP_KEYFRAMES = `
@keyframes board-fade-out { to { opacity: 0; } }
@keyframes board-fade-in { from { opacity: 0; } }
@keyframes board-from-right { from { opacity: 0; transform: translateX(24px); } }
@keyframes board-from-left { from { opacity: 0; transform: translateX(-24px); } }
`

/** Runs `update`, then animates `stage` (the preview's content) into it. */
function swapBoard(
  update: () => void,
  stage: HTMLElement | null,
  { transition, duration, popover }: PreviewBoard,
  direction: "in" | "out" | "swap",
) {
  if (
    transition === "none" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return flushSync(update)
  // A popover's takeover and a board-to-board hop don't drill: they fade.
  const slide = !popover && direction !== "swap" && transition !== "crossfade"
  if (transition === "slide" || !document.startViewTransition || !stage) {
    flushSync(update)
    stage?.animate(
      slide
        ? slideFrom(direction === "in" ? 24 : -24)
        : [{ opacity: 0 }, { opacity: 1 }],
      { duration, easing: "ease-out" },
    )
    return
  }
  const next = !slide
    ? "board-fade-in"
    : direction === "in"
      ? "board-from-right"
      : "board-from-left"
  swapStyle ??= document.head.appendChild(document.createElement("style"))
  swapStyle.textContent = `${SWAP_KEYFRAMES}
::view-transition-group(board-stage) { animation: none; }
::view-transition-old(board-stage) { animation: board-fade-out ${duration}ms ease-out both; }
::view-transition-new(board-stage) { animation: ${next} ${duration}ms ease-out both; }`
  stage.style.viewTransitionName = "board-stage"
  const run = document.startViewTransition(() => flushSync(update))
  void run.finished.finally(() => {
    stage.style.viewTransitionName = ""
  })
}

const route = getRouteApi("/preview/$slug")

const LOADED_LIBRARIES = new Set<string>(
  iconLibraries
    .map((library) => library.name)
    .filter((name) => name !== "lucide"),
)

// Faces load once the pointer rests on a font, so sweeping the list fetches
// nothing; the preview itself settles later.
const FONT_DWELL_MS = 30
let fontTimer: ReturnType<typeof setTimeout> | undefined
function warmFonts(families: string[]) {
  clearTimeout(fontTimer)
  fontTimer = setTimeout(() => loadFontFaces(document, families), FONT_DWELL_MS)
}

// Live color changes compute their CSS off the main thread; the release
// waits for the job already computing its color.
const prepareThemeCss: PrepareDesignSystem<string | undefined> = (
  { data: { color }, live },
  ready,
) => {
  if (color) requestThemeCss(color, live, ready)
  else ready(undefined)
}

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

// While the next preview's loader runs, the router keeps the current one on
// screen: dim it under a spinner so the switch shows at once.
function PendingOverlay({ loading }: { loading: boolean }) {
  const routing = useRouterState({ select: (s) => s.status === "pending" })
  const pending = routing || loading
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-bg/60 opacity-0 transition-opacity duration-150",
        pending && "opacity-100",
      )}
    >
      {pending && <Loader className="size-5 text-fg-muted" />}
    </div>
  )
}

export function PreviewPage() {
  const { slug } = route.useParams()
  // Boots on the current design system (same origin, same storage); the
  // studio's messages take over from there.
  const { designSystem, prepared: themeCss } = useAppliedDesignSystem(
    prepareThemeCss,
    () => {
      const initial = designSystemOf(getCurrent().state)
      return {
        designSystem: initial,
        prepared: initial.color && themeCssNow(initial.color),
      }
    },
    // A message's clone, its selections one object again for the style caches.
    internDesignSystem,
  )

  const navigate = route.useNavigate()

  // What the studio is about to preview starts loading now.
  const [warmIcons, setWarmIcons] = useState<IconLibraryName[]>([])
  useMessage("preview-warm", ({ fonts, icons }) => {
    if (fonts) warmFonts(fonts)
    const added = (icons ?? []).filter((name) => LOADED_LIBRARIES.has(name))
    if (added.length)
      setWarmIcons((prev) => {
        const next = [...new Set([...prev, ...added])] as IconLibraryName[]
        return next.length === prev.length ? prev : next
      })
  })

  // The parent switches previews by navigating this document's own router — the
  // iframe never remounts, so the module cache and design-system state survive
  // and revisited previews render instantly. `replace` keeps these switches out
  // of the shared browsing history; the route loader keeps the current preview
  // on screen while a first-visit chunk loads.
  useMessage("preview-navigate", ({ slug: next }) => {
    if (next === slug) return
    void navigate({
      to: "/preview/$slug",
      params: { slug: next },
      search: (prev) => prev,
      replace: true,
    })
  })
  useMessage("preview-prefetch", ({ slug: next }) => {
    void getExamplesPromise(next)
  })

  // The board the panel is editing, over the user's preview. Kept alive, the
  // preview stays mounted under it (hidden, updating at idle priority), so
  // coming back doesn't render it from scratch.
  const [board, setBoard] = useState<{
    slug: string
    Examples: React.ComponentType
  } | null>(null)
  const [boardLoading, setBoardLoading] = useState(false)
  const [keepAlive, setKeepAlive] = useState(false)
  const requested = useRef<string | null>(null)
  const shownBoard = useRef<string | null>(null)
  const previewScroll = useRef(0)
  const stage = useRef<HTMLDivElement>(null)
  useMessage("preview-board", (message) => {
    const next = message.slug
    setKeepAlive(message.keepAlive)
    if (next === requested.current) return
    requested.current = next
    const show = (view: typeof board) => {
      setBoardLoading(false)
      const from = shownBoard.current
      if ((view?.slug ?? null) === from) return
      shownBoard.current = view?.slug ?? null
      const direction = !from ? "in" : !view ? "out" : "swap"
      if (!from) previewScroll.current = window.scrollY
      swapBoard(
        () => {
          setBoard(view)
          window.scrollTo(0, view ? 0 : previewScroll.current)
        },
        stage.current,
        message,
        direction,
      )
    }
    if (!next) return show(null)
    const promise = getExamplesPromise(next)
    if (!promise) return show(null)
    setBoardLoading(true)
    void promise.then((mod) => {
      if (requested.current === next)
        show({ slug: next, Examples: mod.default })
    })
  })

  // The route loader resolved the example chunk before this render, so this
  // effect runs with the previewed content committed.
  useAnnouncePreviewReady()

  const embedded = typeof window !== "undefined" && isInIframe()
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

  // Elastic overscroll pulls this page away and reveals the <iframe> element,
  // which the studio paints in its own theme — repaint it with ours.
  useEffect(() => {
    const frame = window.frameElement as HTMLElement | null
    if (!frame) return
    const paint = () => {
      frame.style.backgroundColor = getComputedStyle(
        document.body,
      ).backgroundColor
    }
    paint()
    // Mode flips land on <html> from the root ThemeProvider's effect, after this one.
    const observer = new MutationObserver(paint)
    observer.observe(document.documentElement, { attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [designSystem.color, themeCss])

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
  const preview = slug === "overview" ? overview : examples
  const boardContent = useMemo(
    () => board && <board.Examples key={board.slug} />,
    [board],
  )
  const content = keepAlive ? (
    <>
      <Activity mode={board ? "hidden" : "visible"}>{preview}</Activity>
      {boardContent}
    </>
  ) : (
    (boardContent ?? preview)
  )
  if (!preview && !boardContent) {
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
      themeCss={themeCss}
      icons={designSystem.icons}
    >
      {chrome}
      <BoardFocusProvider>
        <div ref={stage}>{content}</div>
      </BoardFocusProvider>
      {warmIcons.length > 0 && <WarmIcons libraries={warmIcons} />}
      <PendingOverlay loading={boardLoading} />
    </DesignSystemProvider>
  )
}
