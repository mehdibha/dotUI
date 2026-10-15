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
  ChevronLeftIcon,
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

import { setPageFocus } from "./focus"
import { PanelChrome } from "./panel"
import type { PanelSystem } from "./panel"
import { DockLayer, PanelNav, useDockSide } from "./rows"
import { PanelSearch } from "./search"
import { linkTarget, placeOf } from "./state"
import type { Chapter, Studio } from "./state"
import { flashAxis, revealRow, RevealAxis } from "./use-axis"

/** The open page is the URL's hash, so a reload or a shared link reopens it. */
function setHash(page: string | null) {
  const url = location.pathname + location.search + (page ? `#${page}` : "")
  if (url !== location.pathname + location.search + location.hash)
    history.replaceState(history.state, "", url)
}

/* Drilling in slides the page in from the right; Back slides the chapters in
   from the left. A link opening a page, or a chapter switch, doesn't move. */
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
}: {
  chapter: Chapter
  studio: Studio
  docked: boolean
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
      <h2
        id={`chapter-${chapter.id}`}
        className="truncate px-1 text-xs/9 font-medium text-fg/50 max-lg:sr-only"
      >
        {chapter.label}
      </h2>
      <div className="flex flex-col gap-1.5 pb-2.5 max-lg:py-2">
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
  const [drill, setDrill] = useState<keyof typeof DRILL | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const scrolled = useRef(0)
  const back = useRef<HTMLButtonElement>(null)
  // Set by a press that swaps pages: focus moves with it.
  const moveFocus = useRef(false)
  const lastPage = useRef<string | null>(null)
  const pages = useMemo(
    () =>
      chapters.flatMap((chapter) =>
        (chapter.pages ?? []).map((page) => ({ ...page, chapter })),
      ),
    [chapters],
  )
  const page = pages.find((p) => p.id === pageId)
  // Beside the preview, tucking would only empty the column.
  const side = useDockSide()
  const open = !tucked || side

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
    if (!moveFocus.current) return
    moveFocus.current = false
    if (pageId) back.current?.focus()
    else
      untilMounted(() => {
        const row = layer?.querySelector<HTMLElement>(
          `[data-page-link="${left}"]`,
        )
        row?.focus()
        return !!row
      })
  }, [pageId, layer])

  // Going back lands where the page was left; a new page opens at its top.
  useLayoutEffect(() => {
    if (scroller.current)
      scroller.current.scrollTop = pageId ? 0 : scrolled.current
  }, [pageId])

  const openPage = useCallback(
    (id: string) => {
      const target = pages.find((p) => p.id === id)
      if (!target) return
      if (!pageId) scrolled.current = scroller.current?.scrollTop ?? 0
      setDrill("in")
      setActive(target.chapter.id)
      setPageId(id)
      setHash(id)
    },
    [pages, pageId],
  )

  // A row press moves focus with the swap; search and deep links don't.
  const navigate = useCallback(
    (id: string) => {
      moveFocus.current = true
      openPage(id)
    },
    [openPage],
  )

  const dock = useCallback(
    (id: string, axis?: string) => {
      setActive(id)
      setTucked(false)
      setDrill(null)
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
  const follow = useEffectEvent(() => {
    const target = linkTarget(decodeURIComponent(location.hash.slice(1)))
    if (!target) return
    setTucked(false)
    if ("page" in target) openPage(target.page)
    else revealAxis(target.key)
    setDrill(null)
  })
  useEffect(() => {
    follow()
    window.addEventListener("hashchange", follow)
    return () => window.removeEventListener("hashchange", follow)
  }, [])

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
                <ChapterStrip
                  chapters={chapters}
                  active={active}
                  open={open}
                  onChange={dock}
                />
              }
              page={
                open &&
                page && (
                  <>
                    <Button
                      ref={back}
                      size="sm"
                      variant="quiet"
                      isIconOnly
                      aria-label={`Back to ${page.chapter.label}`}
                      onPress={() => {
                        moveFocus.current = true
                        setDrill("out")
                        setPageId(null)
                        setHash(null)
                      }}
                      className="data-icon-only:size-7 pointer-coarse:data-icon-only:size-9"
                    >
                      <ChevronLeftIcon />
                    </Button>
                    <span
                      key={page.id}
                      className={cn(
                        "min-w-0 flex-1 truncate text-[13px] font-medium",
                        drill === "in" && DRILL.in,
                      )}
                    >
                      {page.label}
                    </span>
                  </>
                )
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
                    "flex w-full shrink-0 flex-col gap-1.5 pb-2.5 max-lg:py-2",
                    !open && "max-lg:hidden",
                    drill === "in" && DRILL.in,
                  )}
                >
                  <page.Body studio={studio} />
                </section>
              ) : (
                <div
                  className={cn(
                    "flex w-full shrink-0 flex-col",
                    drill === "out" && DRILL.out,
                  )}
                >
                  {chapters.map((chapter) => (
                    <ChapterBlock
                      key={chapter.id}
                      chapter={chapter}
                      studio={studio}
                      docked={open && chapter.id === active}
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
