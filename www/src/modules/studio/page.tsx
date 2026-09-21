"use client"

/* The panel's one page (Sept 2026): every chapter a folder, open by default.
   An open folder shows its primary rows first, then the rest of its body. */

import { Fragment, useRef, useState } from "react"

import { DialFolder } from "./dial"
import { resolveIndex } from "./groups"
import type { IndexChapter } from "./groups"
import { PanelChrome } from "./panel"
import type { PanelSystem } from "./panel"
import { GroupTitle } from "./rows"
import { PanelSearch } from "./search"
import type { Chapter, Studio } from "./state"

function ChapterFolder({
  chapter,
  studio,
  open,
  onOpenChange,
}: {
  chapter: IndexChapter
  studio: Studio
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { modified } = studio.section(chapter.defaults)
  const host = chapter.members[0]
  const Primary = chapter.hostless ? undefined : host?.Primary
  const body = chapter.members.map((member, i) => (
    <Fragment key={member.id}>
      {(chapter.hostless || i > 0) && <GroupTitle>{member.label}</GroupTitle>}
      <member.Body studio={studio} />
    </Fragment>
  ))
  return (
    <DialFolder
      id={chapter.id}
      title={chapter.label}
      modified={modified}
      open={open}
      onOpenChange={onOpenChange}
    >
      {Primary && <Primary studio={studio} />}
      {body}
    </DialFolder>
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
  const index = resolveIndex(chapters)
  const [open, setOpen] = useState<ReadonlySet<string>>(
    () => new Set(index.map((chapter) => chapter.id)),
  )
  const setChapterOpen = (id: string, next: boolean) =>
    setOpen((prev) => {
      const set = new Set(prev)
      if (next) set.add(id)
      else set.delete(id)
      return set
    })
  const rootRef = useRef<HTMLDivElement>(null)
  const reveal = (id: string) => {
    setChapterOpen(id, true)
    rootRef.current
      ?.querySelector(`[data-folder="${id}"]`)
      ?.scrollIntoView({ block: "start" })
  }

  return (
    <div ref={rootRef} className="contents">
      <PanelChrome
        studio={studio}
        system={system}
        search={<PanelSearch chapters={index} onOpenChapter={reveal} />}
      >
        {index.map((chapter) => (
          <ChapterFolder
            key={chapter.id}
            chapter={chapter}
            studio={studio}
            open={open.has(chapter.id)}
            onOpenChange={(next) => setChapterOpen(chapter.id, next)}
          />
        ))}
      </PanelChrome>
    </div>
  )
}
