"use client"

/* The panel's one page (Sept 2026): every chapter in full, a quiet title with
   the chapter's specimen beside it, then its primary rows and the rest of
   its body. Nothing folds — search scrolls to a chapter, it never opens one.

   Below `lg` the same page is a dock under the preview (beside it on short
   screens): a chapter strip that scrolls sideways and one chapter's rows
   under it, hugging them. The header's chevron tucks it to its strip. */

import { useEffect, useRef, useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"

import { PanelChrome } from "./panel"
import type { PanelSystem } from "./panel"
import { DOCKED_QUERY, DockLayer } from "./rows"
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
  const { Primary, Body, Preview } = chapter
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
        className="flex h-9 items-center justify-between gap-2 px-1 max-lg:sr-only"
      >
        <span className="truncate text-xs font-medium text-fg/50">
          {chapter.label}
        </span>
        {Preview && (
          <span className="flex shrink-0 items-center text-fg/60">
            <Preview state={studio.state} />
          </span>
        )}
      </h2>
      <div className="flex flex-col gap-1.5 pb-2.5">
        {Primary && <Primary studio={studio} />}
        <Body studio={studio} />
      </div>
    </section>
  )
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
    <RacToggleButtonGroup
      ref={ref}
      aria-label="Chapters"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[active]}
      style={{
        maskImage: `linear-gradient(to right, ${edges.start ? "transparent" : "#000"}, #000 24px, #000 calc(100% - 24px), ${edges.end ? "transparent" : "#000"})`,
      }}
      className="relative -mx-2 no-scrollbar flex gap-1 overflow-x-auto px-2 pt-1 lg:hidden"
    >
      {chapters.map((chapter) => (
        <RacToggleButton
          key={chapter.id}
          id={chapter.id}
          onPress={() => onChange(chapter.id)}
          className={cn(
            "flex h-8 shrink-0 cursor-interactive items-center rounded-lg px-3 text-[13px] font-medium text-fg/60 focus-reset hover:tint-5 focus-visible:focus-ring pointer-coarse:h-9 selected:text-fg",
            open ? "selected:tint-10" : "selected:tint-5",
          )}
        >
          {chapter.label}
        </RacToggleButton>
      ))}
    </RacToggleButtonGroup>
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
  const [open, setOpen] = useState(true)

  const dock = (id: string) => {
    setActive(id)
    setOpen(true)
    layer?.firstElementChild?.scrollTo({ top: 0 })
  }
  const reveal = (id: string) => {
    if (window.matchMedia(DOCKED_QUERY).matches) return dock(id)
    layer
      ?.querySelector(`[data-chapter="${id}"]`)
      ?.scrollIntoView({ block: "start" })
  }

  return (
    <DockLayer.Provider value={layer}>
      {/* Docked, the positioned box row popovers portal into. */}
      <div
        ref={setLayer}
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
                onPress={() => setOpen(!open)}
                className="lg:hidden pointer-coarse:size-9"
              >
                <ChevronDownIcon className={cn(!open && "rotate-180")} />
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
              ? "[@media(max-width:1023px)_and_(min-height:501px)]:h-auto [@media(max-width:1023px)_and_(min-height:501px)]:max-h-[42svh]"
              : "max-lg:h-auto max-lg:pb-0 max-lg:[&>:first-child]:mb-0 max-lg:[&>:first-child]:border-b-0"
          }
        >
          {chapters.map((chapter) => (
            <ChapterBlock
              key={chapter.id}
              chapter={chapter}
              studio={studio}
              docked={open && chapter.id === active}
            />
          ))}
        </PanelChrome>
      </div>
    </DockLayer.Provider>
  )
}
