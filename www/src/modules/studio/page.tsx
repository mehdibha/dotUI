"use client"

/* The panel's one page (Sept 2026): every chapter in full, a quiet title with
   the chapter's specimen beside it, then its primary rows and the rest of
   its body. Nothing folds — search scrolls to a chapter, it never opens one.

   Below `lg` the same page is a dock under the preview: a chapter strip that
   scrolls sideways and one chapter's rows under it. Tapping the open chapter
   tucks the dock down to its strip. */

import { useRef, useState } from "react"
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import { cn } from "@/registry/lib/utils"

import { PanelChrome } from "./panel"
import type { PanelSystem } from "./panel"
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
      className={cn(
        "flex w-full shrink-0 flex-col",
        !docked && "max-lg:hidden",
      )}
    >
      <h2 className="flex h-9 items-center justify-between gap-2 px-1 max-lg:hidden">
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

function ChapterStrip({
  chapters,
  active,
  onChange,
}: {
  chapters: Chapter[]
  active: string | null
  onChange: (id: string | null) => void
}) {
  return (
    <RacToggleButtonGroup
      aria-label="Chapters"
      selectionMode="single"
      selectedKeys={active ? [active] : []}
      onSelectionChange={(keys) =>
        onChange((keys.values().next().value as string | undefined) ?? null)
      }
      className="-mx-2 no-scrollbar flex gap-1 overflow-x-auto px-2 pt-2 lg:hidden"
    >
      {chapters.map((chapter) => (
        <RacToggleButton
          key={chapter.id}
          id={chapter.id}
          className="flex h-8 shrink-0 cursor-interactive items-center rounded-lg px-3 text-[13px] font-medium text-fg/60 focus-reset hover:tint-5 focus-visible:focus-ring selected:tint-10 selected:text-fg"
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
  const rootRef = useRef<HTMLDivElement>(null)
  const [docked, setDocked] = useState<string | null>(chapters[0]?.id ?? null)

  const dock = (id: string | null) => {
    setDocked(id)
    rootRef.current?.firstElementChild?.scrollTo({ top: 0 })
  }
  const reveal = (id: string) => {
    if (window.matchMedia("(max-width: 1023px)").matches) return dock(id)
    rootRef.current
      ?.querySelector(`[data-chapter="${id}"]`)
      ?.scrollIntoView({ block: "start" })
  }

  return (
    <div ref={rootRef} className="contents">
      <PanelChrome
        studio={studio}
        system={system}
        search={<PanelSearch chapters={chapters} onOpenChapter={reveal} />}
        strip={
          <ChapterStrip chapters={chapters} active={docked} onChange={dock} />
        }
        className={
          docked
            ? "max-lg:h-[42svh]"
            : "max-lg:h-auto max-lg:pb-0 max-lg:[&>:first-child]:mb-0 max-lg:[&>:first-child]:border-b-0"
        }
      >
        {chapters.map((chapter) => (
          <ChapterBlock
            key={chapter.id}
            chapter={chapter}
            studio={studio}
            docked={chapter.id === docked}
          />
        ))}
      </PanelChrome>
    </div>
  )
}
