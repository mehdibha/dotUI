"use client"

/* Every chapter on one page, docked under the preview below `lg`. */

import {
  memo,
  useCallback,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  ChevronRightIcon,
  PanelBottomCloseIcon,
  PanelBottomOpenIcon,
} from "lucide-react"
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { getPreset, ORIGIN } from "@/modules/presets"

import { DEFAULTS } from "./axes"
import type { StudioState } from "./axes"
import { linkTarget, placeOf } from "./chapters"
import type { Chapter } from "./chapters"
import { setPageFocus } from "./focus"
import {
  MergedTitle,
  PageActions,
  PageHeader,
  PageSteps,
  InlineTitle,
  AttachedTitle,
  usePageHeaderTweaks,
} from "./page-header"
import type { PageHeaderProps } from "./page-header"
import { PanelChrome } from "./panel"
import type { PanelSystem } from "./panel"
import { useMessage } from "./preset/iframe-sync"
import { DockLayer, PanelNav, useDockSide } from "./rows"
import { PanelSearch } from "./search"
import { describe, useCurrent } from "./selection"
import { flashAxis, revealRow, RevealAxis } from "./use-axis"
import type { Studio } from "./use-studio"
import { getWorkspace } from "./workspace"

/** The open page is the URL's hash, so a reload or a shared link reopens it. */
function setHash(page: string | null) {
  const url = location.pathname + location.search + (page ? `#${page}` : "")
  if (url !== location.pathname + location.search + location.hash)
    history.replaceState(history.state, "", url)
}

/* Drilling in slides the page in from the right; Back slides the chapters in
   from the left. A link opening a page, or a chapter switch, doesn't move. */
/** The state the design system started from: its view, or a system's preset. */
function useBase(): StudioState {
  const current = useCurrent()
  if (current.doc) return (getPreset(current.doc.from ?? "") ?? ORIGIN).state
  return describe(current.view, getWorkspace()).state
}

/* Component pages whose docs page goes by another slug; Choice card has none. */
const DOCS: Record<string, string | null> = {
  chart: "/docs/charts",
  "choice-card": null,
  progress: "/docs/components/progress-bar",
  radio: "/docs/components/radio-group",
  spinner: "/docs/components/loader",
}

const docsOf = (id: string) =>
  id in DOCS ? (DOCS[id] ?? undefined) : `/docs/components/${id}`

const DRILL = {
  in: "animate-in fade-in slide-in-from-right-6 duration-200 ease-out motion-reduce:animate-none",
  out: "animate-in fade-in slide-in-from-left-6 duration-200 ease-out motion-reduce:animate-none",
}

/** Retries each frame: a page's rows mount a frame or more after it opens. */
function untilMounted(attempt: () => boolean, frames = 30) {
  requestAnimationFrame(() => {
    if (!attempt() && frames > 0) untilMounted(attempt, frames - 1)
  })
}

// Re-renders with the state or its dock, never with the panel's own updates.
const ChapterBlock = memo(function ChapterBlock({
  chapter,
  studio,
  docked,
  first,
}: {
  chapter: Chapter
  studio: Studio
  docked: boolean
  first: boolean
}) {
  const { Body } = chapter
  return (
    <section
      data-chapter={chapter.id}
      aria-labelledby={`chapter-${chapter.id}`}
      className={cn(
        "flex w-full shrink-0 flex-col",
        !docked && "max-lg:hidden",
      )}
    >
      {!first && (
        <div
          role="separator"
          className="mx-2.5 mt-4 mb-3 h-px bg-fg/8 max-lg:hidden"
        />
      )}
      <h2
        id={`chapter-${chapter.id}`}
        className={cn(
          "truncate px-2.5 pb-2 text-xs/4 font-medium text-fg/50 max-lg:sr-only",
          chapter.untitled && "sr-only",
        )}
      >
        {chapter.label}
      </h2>
      <div className="flex flex-col gap-1.5 max-lg:py-2">
        <Body studio={studio} />
      </div>
    </section>
  )
})

/* Room kept past the selected chip, so the next one always peeks. */
const STRIP_MARGIN = 32

const ChapterStrip = memo(function ChapterStrip({
  chapters,
  active,
  open,
  onChange,
}: {
  chapters: Chapter[]
  active: string
  open: boolean
  onChange: (id: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: false, end: true })

  useEffect(() => {
    const strip = ref.current
    if (!strip) return
    const update = () =>
      setEdges({
        start: strip.scrollLeft > 1,
        end: strip.scrollLeft < strip.scrollWidth - strip.clientWidth - 1,
      })
    update()
    strip.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      strip.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  useEffect(() => {
    const strip = ref.current
    const chip = strip?.querySelector<HTMLElement>("[data-selected]")
    if (!strip || !chip) return
    const left = chip.offsetLeft - STRIP_MARGIN
    const right =
      chip.offsetLeft + chip.offsetWidth + STRIP_MARGIN - strip.clientWidth
    if (strip.scrollLeft > left) strip.scrollLeft = left
    else if (strip.scrollLeft < right) strip.scrollLeft = right
  }, [active])

  return (
    <div className="relative -mx-2 lg:hidden">
      <RacToggleButtonGroup
        ref={ref}
        aria-label="Chapters"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={[active]}
        style={{
          // Faded, not erased: a cut-off chip is the cue that the strip scrolls.
          maskImage: `linear-gradient(to right, ${edges.start ? "rgb(0 0 0/0.3)" : "#000"}, #000 24px, #000 calc(100% - 24px), ${edges.end ? "rgb(0 0 0/0.3)" : "#000"})`,
        }}
        className="relative no-scrollbar flex gap-1 overflow-x-auto px-2 pt-1"
      >
        {chapters.map((chapter) => (
          <RacToggleButton
            key={chapter.id}
            id={chapter.id}
            onPress={() => onChange(chapter.id)}
            className={cn(
              "flex h-8 shrink-0 cursor-interactive items-center rounded-lg px-3 text-[13px] font-medium text-fg/60 focus-reset hover:tint-5 focus-visible:focus-ring pointer-coarse:h-9 pointer-coarse:px-2.5 selected:text-fg",
              open ? "selected:tint-10" : "selected:tint-5",
            )}
          >
            {chapter.label}
          </RacToggleButton>
        ))}
      </RacToggleButtonGroup>
      {/* The same cue at every width, whether or not a chip happens to peek.
          Visual only: swipes and taps reach the strip under it. */}
      {edges.end && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-0 flex h-8 w-10 items-center justify-end bg-linear-to-l from-card from-50% to-transparent pr-1.5 text-fg/50 pointer-coarse:h-9"
        >
          <ChevronRightIcon className="size-4" />
        </span>
      )}
    </div>
  )
})

// A search hit lands on its row (a sub-axis on the row that holds it).
function flash(container: Element | null | undefined, label: string) {
  const row = [...(container?.querySelectorAll("span") ?? [])].find(
    (span) => span.textContent === label,
  )
  const target = row?.closest(".rounded-lg") ?? row
  if (!target) return false
  revealRow(target)
  return true
}

export function PanelPage({
  chapters,
  studio,
  system,
}: {
  chapters: Chapter[]
  studio: Studio
  system: PanelSystem
}) {
  const [layer, setLayer] = useState<HTMLDivElement | null>(null)
  const [active, setActive] = useState(chapters[0]?.id ?? "")
  const [tucked, setTucked] = useState(false)
  const [pageId, setPageId] = useState<string | null>(null)
  // The pages Back leads through, nearest last.
  const [trail, setTrail] = useState<string[]>([])
  const [drill, setDrill] = useState<keyof typeof DRILL | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  // Where each page (the main one under "") was left, for Back.
  const scrolled = useRef(new Map<string, number>())
  const back = useRef<HTMLButtonElement>(null)
  // Set by a press that swaps pages: focus moves with it.
  const moveFocus = useRef(false)
  // Set by a prev / next press: focus lands on the same step of the new page.
  const stepFocus = useRef<"prev" | "next" | null>(null)
  const lastPage = useRef<string | null>(null)
  const pages = useMemo(
    () =>
      chapters.flatMap((chapter) =>
        (chapter.pages ?? []).map((page) => ({ ...page, chapter })),
      ),
    [chapters],
  )
  const page = pages.find((p) => p.id === pageId)
  const behind = pages.find((p) => p.id === trail.at(-1))
  // Beside the preview, tucking would only empty the column.
  const side = useDockSide()
  const open = !tucked || side

  const tweaks = usePageHeaderTweaks()
  const base = useBase()
  const pageKeys = useMemo(
    () =>
      page
        ? (Object.keys(DEFAULTS).filter(
            (key) => placeOf(key)?.page?.id === page.id,
          ) as (keyof StudioState & string)[])
        : [],
    [page],
  )
  const changed = pageKeys.some(
    (key) => JSON.stringify(studio.state[key]) !== JSON.stringify(base[key]),
  )
  const siblings =
    page && page.chapter.id === "components" && page.id !== "components"
      ? pages.filter(
          (p) => p.chapter.id === "components" && p.id !== "components",
        )
      : []
  const at = siblings.findIndex((p) => p.id === page?.id)
  const step = (offset: number) => {
    const target = siblings[at + offset]
    return (
      target && {
        label: target.label,
        go: () => {
          stepFocus.current = offset > 0 ? "next" : "prev"
          openPage(target.id, trail)
          setDrill(offset > 0 ? "in" : "out")
        },
      }
    )
  }

  // Docked popovers cover the rows, never the chrome: they sit off its height.
  useEffect(() => {
    const header = layer?.firstElementChild?.firstElementChild
    if (!layer || !(header instanceof HTMLElement)) return
    const observer = new ResizeObserver(() =>
      layer.style.setProperty("--dock-chrome", `${header.offsetHeight}px`),
    )
    observer.observe(header)
    return () => observer.disconnect()
  }, [layer])

  useEffect(() => {
    setPageFocus(page?.id ?? null)
    return () => setPageFocus(null)
  }, [page?.id])

  // The pressed row unmounts with the swap: focus lands on Back, and going
  // back lands on the row that opened the page.
  useEffect(() => {
    const left = lastPage.current
    lastPage.current = pageId
    const stepped = stepFocus.current
    stepFocus.current = null
    if (stepped) {
      // The pressed step may have remounted with the page, or be disabled at
      // either end of the list: Back takes focus then.
      untilMounted(() => {
        const button = layer?.querySelector<HTMLElement>(
          `[data-step="${stepped}"]:not([disabled])`,
        )
        if (button) button.focus()
        else if (document.activeElement === document.body) back.current?.focus()
        return true
      })
      return
    }
    if (!moveFocus.current) return
    moveFocus.current = false
    if (drill !== "out") back.current?.focus()
    else
      untilMounted(() => {
        const row = layer?.querySelector<HTMLElement>(
          `[data-page-link="${left}"]`,
        )
        row?.focus()
        return !!row
      })
  }, [pageId, drill, layer])

  // Going back lands where the page was left; a new page opens at its top.
  useLayoutEffect(() => {
    if (scroller.current)
      scroller.current.scrollTop =
        drill === "out" || !pageId
          ? (scrolled.current.get(pageId ?? "") ?? 0)
          : 0
  }, [pageId, drill])

  const openPage = useCallback(
    (id: string, from?: string[]) => {
      const target = pages.find((p) => p.id === id)
      if (!target) return
      scrolled.current.set(pageId ?? "", scroller.current?.scrollTop ?? 0)
      setDrill("in")
      setActive(target.chapter.id)
      setTrail(from ?? (target.parent ? [target.parent] : []))
      setPageId(id)
      setHash(id)
    },
    [pages, pageId],
  )

  // A row press moves focus with the swap, and Back retraces it; search and
  // deep links don't move focus, and Back leads to the page's parent.
  const navigate = useCallback(
    (id: string) => {
      moveFocus.current = true
      openPage(id, pageId ? [...trail, pageId] : [])
    },
    [openPage, pageId, trail],
  )

  const dock = useCallback(
    (id: string, axis?: string) => {
      setActive(id)
      setTucked(false)
      setDrill(null)
      setTrail([])
      setPageId(null)
      if (pageId) setHash(null)
      requestAnimationFrame(() => {
        const chapter = layer?.querySelector(`[data-chapter="${id}"]`)
        chapter?.scrollIntoView({ block: "start" })
        if (axis) flash(chapter, axis.split(" › ")[0]!)
      })
    },
    [layer, pageId],
  )

  // An open docked picker leaves the chrome in view but inert: a tap there
  // lands on this layer and only closes the picker. Once it has closed (not
  // after a drag that ends here), replay the tap on the button under it.
  const replay = (event: React.PointerEvent) => {
    if (event.target !== event.currentTarget) return
    const header = layer?.firstElementChild?.firstElementChild
    const { clientX: x, clientY: y } = event
    const button = [...(header?.querySelectorAll("button") ?? [])].find(
      (button) => {
        const r = button.getBoundingClientRect()
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
      },
    )
    if (!button) return
    requestAnimationFrame(() => {
      if (!button.closest("[inert]")) button.click()
    })
  }

  const reveal = useCallback(
    (id: string, axis?: string) => {
      // "Checkbox › Corner" names a page and its row; a row a popover holds
      // ("Dialog › Backdrop › Frost") lands on the row that opens it.
      const [first, row] = axis?.split(" › ") ?? []
      const target = pages.find((p) => p.chapter.id === id && p.label === first)
      if (target) {
        setTucked(false)
        openPage(target.id)
        if (row)
          untilMounted(() =>
            flash(layer?.querySelector(`[data-page="${target.id}"]`), row),
          )
        return
      }
      dock(id, axis)
    },
    [pages, openPage, layer, dock],
  )

  // A cause chip lands on its row: in view already, else on its
  // page or chapter first.
  const revealAxis = useCallback(
    (key: string) => {
      if (flashAxis(key)) return
      const place = placeOf(key)
      if (!place) return
      if (place.page) openPage(place.page.id)
      else dock(place.chapter.id)
      untilMounted(() => flashAxis(key))
    },
    [openPage, dock],
  )

  // `/studio#<page>` opens a page; a one-row component's id lands on its row.
  const land = (hash: string) => {
    const target = linkTarget(hash)
    if (!target) return
    setTucked(false)
    if ("page" in target) openPage(target.page)
    else revealAxis(target.key)
    setDrill(null)
  }
  const follow = useEffectEvent(() =>
    land(decodeURIComponent(location.hash.slice(1))),
  )
  useEffect(() => {
    follow()
    window.addEventListener("hashchange", follow)
    return () => window.removeEventListener("hashchange", follow)
  }, [])

  // A component clicked in the preview's inspector lands like its deep link.
  useMessage("preview-inspect", ({ panel }) =>
    land(panel.replace(/^component:/, "")),
  )

  const header: PageHeaderProps | undefined = page && {
    title: page.label,
    parent:
      behind?.label ?? (page.chapter.untitled ? "Back" : page.chapter.label),
    backRef: back,
    onBack: () => {
      moveFocus.current = true
      setDrill("out")
      setTrail(trail.slice(0, -1))
      setPageId(behind?.id ?? null)
      setHash(behind?.id ?? null)
    },
    titleClass: drill ? DRILL[drill] : undefined,
    steps:
      tweaks.steps === "header" && siblings.length
        ? { prev: step(-1), next: step(1) }
        : undefined,
    onReset:
      tweaks.resetPage && changed
        ? () =>
            studio.setState({
              ...studio.state,
              ...Object.fromEntries(pageKeys.map((key) => [key, base[key]])),
            })
        : undefined,
    docs: tweaks.docs && siblings.length ? docsOf(page.id) : undefined,
  }

  return (
    <RevealAxis.Provider value={revealAxis}>
      <PanelNav.Provider value={navigate}>
        <DockLayer.Provider value={layer}>
          {/* Docked, the positioned box row popovers portal into. */}
          <div
            ref={setLayer}
            onPointerUp={replay}
            className="contents max-lg:relative max-lg:flex max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col"
          >
            <PanelChrome
              system={system}
              actions={
                <>
                  {open && page && header && tweaks.layout === "merged" && (
                    <PageActions {...header} />
                  )}
                  <PanelSearch chapters={chapters} onOpenChapter={reveal} />
                  <Button
                    size="sm"
                    variant="quiet"
                    isIconOnly
                    aria-label={open ? "Collapse panel" : "Expand panel"}
                    aria-expanded={open}
                    onPress={() => setTucked(open)}
                    className="data-icon-only:size-6 lg:hidden pointer-coarse:data-icon-only:size-9 dock-side:hidden"
                  >
                    {open ? <PanelBottomCloseIcon /> : <PanelBottomOpenIcon />}
                  </Button>
                </>
              }
              strip={
                <>
                  <ChapterStrip
                    chapters={chapters}
                    active={active}
                    open={open}
                    onChange={dock}
                  />
                  {open && header && tweaks.layout === "attached" && (
                    <AttachedTitle {...header} />
                  )}
                </>
              }
              title={
                open && page && header && tweaks.layout === "merged" ? (
                  <MergedTitle {...header} />
                ) : undefined
              }
              page={
                open &&
                page &&
                header && <PageHeader layout={tweaks.layout} {...header} />
              }
              scrollRef={scroller}
              className={
                open
                  ? "dock-stacked:h-auto dock-stacked:max-h-[42svh]"
                  : "max-lg:h-auto max-lg:*:first:border-0"
              }
            >
              {page ? (
                <section
                  key={page.id}
                  data-page={page.id}
                  aria-label={page.label}
                  className={cn(
                    "flex w-full shrink-0 flex-col gap-1.5 max-lg:py-2",
                    !open && "max-lg:hidden",
                    drill && DRILL[drill],
                  )}
                >
                  {header && tweaks.layout === "inline" && (
                    <InlineTitle {...header} />
                  )}
                  <page.Body studio={studio} />
                  {tweaks.steps === "footer" && siblings.length > 0 && (
                    <PageSteps steps={{ prev: step(-1), next: step(1) }} />
                  )}
                </section>
              ) : (
                <div
                  className={cn(
                    "flex w-full shrink-0 flex-col",
                    drill === "out" && DRILL.out,
                  )}
                >
                  {chapters.map((chapter, i) => (
                    <ChapterBlock
                      key={chapter.id}
                      chapter={chapter}
                      studio={studio}
                      docked={open && chapter.id === active}
                      first={i === 0}
                    />
                  ))}
                </div>
              )}
            </PanelChrome>
          </div>
        </DockLayer.Provider>
      </PanelNav.Provider>
    </RevealAxis.Provider>
  )
}
