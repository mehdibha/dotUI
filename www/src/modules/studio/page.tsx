"use client"

/* The panel's one page: every group's rows in full, no titles — a separator
   between groups, and each row carries its own value and specimen. Nothing
   folds; search scrolls to a group, it never opens one.

   Below `lg` the same page is a dock under the preview (beside it on short
   screens): one chapter's rows, hugged, over a chapter strip that scrolls
   sideways. The header's toggle tucks it to its strip. */

import { Fragment, useEffect, useRef, useState } from "react"
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
import { useTweak } from "@/dev/tweaker"

import { PanelChrome } from "./panel"
import type { PanelSystem } from "./panel"
import { DOCKED_QUERY, DockLayer, useDockSide } from "./rows"
import { PanelSearch } from "./search"
import type { Chapter, Studio } from "./state"

function ChapterBlock({
  chapter,
  studio,
  docked,
}: {
  chapter: Chapter
  studio: Studio
  docked: boolean
}) {
  return (
    <section
      data-chapter={chapter.id}
      aria-label={chapter.label}
      className={cn(
        "flex w-full shrink-0 flex-col gap-1.5 max-lg:py-2",
        !docked && "max-lg:hidden",
      )}
    >
      {chapter.rows.map((Row, i) => (
        <Row key={i} studio={studio} />
      ))}
    </section>
  )
}

/* Between groups on the page; the dock shows one group at a time. */
const SEPARATOR = {
  gap: "h-4",
  hairline: "my-2 h-px bg-fg/6",
  none: "h-1.5",
}

/* Room kept past the selected chip, so the next one always peeks. */
const STRIP_MARGIN = 32

function ChapterStrip({
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
}

export function PanelPage({
  chapters,
  studio,
  system,
}: {
  chapters: Chapter[]
  studio: Studio
  system?: PanelSystem
}) {
  const [layer, setLayer] = useState<HTMLDivElement | null>(null)
  const [active, setActive] = useState(chapters[0]?.id ?? "")
  const [tucked, setTucked] = useState(false)
  // Beside the preview, tucking would only empty the column.
  const side = useDockSide()
  const open = !tucked || side
  const separator = useTweak("Separators", {
    type: "select",
    options: ["gap", "hairline", "none"],
    default: "gap",
    group: "Studio panel",
  })

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

  const dock = (id: string, axis?: string) => {
    setActive(id)
    setTucked(false)
    const scroller = layer?.firstElementChild
    if (!scroller) return
    scroller.scrollTo({ top: 0 })
    if (!axis) return
    // A search hit lands on its row (a sub-axis on the row that holds it).
    requestAnimationFrame(() => {
      const label = axis.split(" › ")[0]
      const row = [
        ...scroller.querySelectorAll(`[data-chapter="${id}"] span`),
      ].find((span) => span.textContent === label)
      const target = row?.closest(".rounded-lg") ?? row
      if (!target) return
      const header = scroller.firstElementChild?.getBoundingClientRect()
      const top = scroller.getBoundingClientRect().top
      const covered = header && header.top <= top + 1 ? header.height : 0
      scroller.scrollTop +=
        target.getBoundingClientRect().top - top - covered - 8
      target.animate(
        {
          boxShadow: [
            "inset 0 0 0 1.5px var(--color-accent)",
            "inset 0 0 0 1.5px transparent",
          ],
        },
        { duration: 1200, easing: "ease-in" },
      )
    })
  }

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

  const reveal = (id: string, axis?: string) => {
    if (window.matchMedia(DOCKED_QUERY).matches) return dock(id, axis)
    layer
      ?.querySelector(`[data-chapter="${id}"]`)
      ?.scrollIntoView({ block: "start" })
  }

  return (
    <DockLayer.Provider value={layer}>
      {/* Docked, the positioned box row popovers portal into. */}
      <div
        ref={setLayer}
        onPointerUp={replay}
        className="contents max-lg:relative max-lg:flex max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col"
      >
        <PanelChrome
          studio={studio}
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
                className="lg:hidden pointer-coarse:data-icon-only:size-9 dock-side:hidden"
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
          className={
            open
              ? "dock-stacked:h-auto dock-stacked:max-h-[42svh]"
              : "max-lg:h-auto max-lg:[&>:first-child]:border-0"
          }
        >
          {chapters.map((chapter, i) => (
            <Fragment key={chapter.id}>
              {i > 0 && (
                <div
                  aria-hidden
                  className={cn("shrink-0 max-lg:hidden", SEPARATOR[separator])}
                />
              )}
              <ChapterBlock
                chapter={chapter}
                studio={studio}
                docked={open && chapter.id === active}
              />
            </Fragment>
          ))}
        </PanelChrome>
      </div>
    </DockLayer.Provider>
  )
}
