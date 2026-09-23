"use client"

/* The panel's one page (Sept 2026): every chapter in full, a quiet title with
   the chapter's specimen beside it, then its primary rows and the rest of
   its body. Nothing folds — search scrolls to a chapter, it never opens one. */

import { useRef } from "react"

import { PanelChrome } from "./panel"
import type { PanelSystem } from "./panel"
import { PanelSearch } from "./search"
import type { Chapter, Studio } from "./state"

function ChapterBlock({
  chapter,
  studio,
}: {
  chapter: Chapter
  studio: Studio
}) {
  const { Primary, Body, Preview } = chapter
  return (
    <section
      data-chapter={chapter.id}
      className="flex w-full shrink-0 flex-col"
    >
      <h2 className="flex h-9 items-center justify-between gap-2 px-1">
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
  const reveal = (id: string) =>
    rootRef.current
      ?.querySelector(`[data-chapter="${id}"]`)
      ?.scrollIntoView({ block: "start" })

  return (
    <div ref={rootRef} className="contents">
      <PanelChrome
        studio={studio}
        system={system}
        search={<PanelSearch chapters={chapters} onOpenChapter={reveal} />}
      >
        {chapters.map((chapter) => (
          <ChapterBlock key={chapter.id} chapter={chapter} studio={studio} />
        ))}
      </PanelChrome>
    </div>
  )
}
