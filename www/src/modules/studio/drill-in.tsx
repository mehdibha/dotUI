"use client"

/* The drill-in panel — the chosen frame (Aug 2026). The index is a run of
   UNTITLED family clusters — each fuses its rows into one ControlGroup card,
   and the gaps alone carry the structure (the iOS-Settings grouped look):
   one line per chapter — label, its muted value where the demo can't carry
   it, and a state-driven micro-preview on the right. Weight survives as
   ordering — identity first. (Per-cluster row heights were tried and
   reverted — uniform h-14 keeps the scan rhythm.)
   Tapping a row swaps panes instantly — control feedback, never gated on
   motion (slide/fade drill-ins were tried and dropped, Aug 2026).
   The chapter page renders the section body as-is — controls only. */

import { Fragment, useEffect, useRef, useState } from "react"
import { ChevronLeftIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { cn } from "@/registry/lib/utils"

import { CARD_DEMOS } from "./demos"
import { resolveIndex } from "./groups"
import type { IndexChapter } from "./groups"
import { PanelChrome } from "./panel"
import type { PanelSystem } from "./panel"
import { ControlGroup, GroupTitle, ROW_LABEL, ROW_VALUE } from "./rows"
import { PanelSearch } from "./search"
import type { Chapter, Studio } from "./state"

const PANE =
  "absolute inset-0 no-scrollbar flex flex-col overflow-y-auto overscroll-contain px-3 pt-[56px] pb-[64px] *:shrink-0"
/* Hidden panes stay mounted (the index keeps its scroll position) but go
   `inert` — invisible, unfocusable, and out of the accessibility tree. */
const PANE_HIDDEN = "opacity-0"

/* Index rows speak the same bg-muted row language as the chapter pages — no
   border, one panel surface behind them. Hover paints a translucent highlight
   OVER the whole card (::after sits on top of the demos too), not just the
   background behind them — the card lifts as one surface. */
const CARD =
  "relative h-14 w-full shrink-0 cursor-interactive rounded-lg bg-muted px-3.5 transition-colors focus-reset focus-visible:focus-ring after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-fg/5 after:opacity-0 after:transition-opacity hover:after:opacity-100 pressed:after:opacity-100"

function IndexRow({
  chapter,
  studio,
  onPress,
}: {
  chapter: IndexChapter
  studio: Studio
  onPress: () => void
}) {
  const status = studio.section(chapter.defaults)
  const Demo = CARD_DEMOS[chapter.id]
  const value = chapter.summary?.(studio.state)
  return (
    <RacButton
      data-row
      data-chapter={chapter.id}
      onPress={onPress}
      className={cn(CARD, "flex items-center gap-5 pr-0")}
    >
      {/* The modified marker lives in the row's edge, one column down the
          list, never in the text run where it reads as punctuation. */}
      {status.modified && (
        <span
          aria-label="Modified"
          className="absolute inset-y-0 left-0 my-auto h-4 w-0.5 rounded-r-full bg-accent"
        />
      )}
      <span className="flex min-w-0 items-center gap-2.5">
        <span className={cn(ROW_LABEL, "shrink-0 whitespace-nowrap")}>
          {chapter.label}
        </span>
        {value && <span className={cn(ROW_VALUE, "min-w-0")}>{value}</span>}
      </span>
      {/* A strip that FITS right-aligns (ml-auto) and centers (my-auto); one
          that OVERFLOWS collapses its auto margins and clips at the edges.
          Its floor is what a long value truncates against. */}
      {Demo && (
        <span
          aria-hidden
          className="pointer-events-none ml-auto flex h-full min-w-28 flex-1 overflow-hidden py-1.5"
        >
          <span className="my-auto ml-auto flex items-center gap-2 pr-3.5">
            <Demo state={studio.state} />
          </span>
        </span>
      )}
    </RacButton>
  )
}

export function DrillInPanel({
  chapters,
  studio,
  system,
}: {
  chapters: Chapter[]
  studio: Studio
  system?: PanelSystem
}) {
  const index = resolveIndex(chapters)
  const [activeId, setActiveId] = useState<string | null>(null)
  const page =
    index
      .flatMap((group) => group.chapters)
      .find((chapter) => chapter.id === activeId) ?? null

  // The page pane is one persistent scroller — start each chapter at its top.
  // The instant swap moves focus with it: drilling in lands on the back
  // button (its subtree is about to go inert under the focused row), backing
  // out returns to the row that was drilled into before its pane goes inert.
  const pageRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const lastIdRef = useRef<string | null>(null)
  useEffect(() => {
    if (activeId) {
      if (pageRef.current) pageRef.current.scrollTop = 0
      backRef.current?.focus()
      lastIdRef.current = activeId
    } else if (lastIdRef.current) {
      indexRef.current
        ?.querySelector<HTMLElement>(`[data-chapter="${lastIdRef.current}"]`)
        ?.focus()
    }
  }, [activeId])

  return (
    <PanelChrome
      studio={studio}
      system={system}
      search={
        <PanelSearch
          chapters={index.flatMap((group) => group.chapters)}
          onOpenChapter={setActiveId}
        />
      }
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* Index pane. */}
        <div
          ref={indexRef}
          className={cn(PANE, "gap-3", page && PANE_HIDDEN)}
          inert={!!page}
        >
          {index.map((group, i) => (
            <Fragment key={i}>
              {group.section && <GroupTitle>{group.section}</GroupTitle>}
              <ControlGroup>
                {group.chapters.map((chapter) => (
                  <IndexRow
                    key={chapter.id}
                    chapter={chapter}
                    studio={studio}
                    onPress={() => setActiveId(chapter.id)}
                  />
                ))}
              </ControlGroup>
            </Fragment>
          ))}
        </div>

        {/* Chapter page. */}
        <div
          ref={pageRef}
          className={cn(PANE, "gap-3 bg-card", !page && PANE_HIDDEN)}
          inert={!page}
        >
          {page && (
            <>
              <div className="mb-1 flex h-8 items-center gap-1">
                <RacButton
                  ref={backRef}
                  onPress={() => setActiveId(null)}
                  className="flex h-8 cursor-interactive items-center gap-1 rounded-lg pr-2.5 pl-1.5 text-[0.8125rem] text-fg-muted focus-reset transition-colors hover:bg-highlight hover:text-fg focus-visible:focus-ring pressed:bg-highlight"
                >
                  <ChevronLeftIcon className="size-4" />
                  All settings
                </RacButton>
                <span className="ml-auto flex items-center gap-1.5 pr-1">
                  <span className="text-[0.8125rem] font-medium text-fg">
                    {page.label}
                  </span>
                </span>
              </div>
              {page.members.map((member, i) => (
                <Fragment key={member.id}>
                  {(page.hostless || i > 0) && (
                    <GroupTitle>{member.label}</GroupTitle>
                  )}
                  <member.Body studio={studio} />
                </Fragment>
              ))}
            </>
          )}
        </div>
      </div>
    </PanelChrome>
  )
}
