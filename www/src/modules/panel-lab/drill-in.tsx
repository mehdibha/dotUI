"use client"

/* The drill-in panel — the chosen frame (Aug 2026). The index is a run of
   UNTITLED family clusters — each fuses its rows into one ControlGroup card,
   and the gaps alone carry the structure (the iOS-Settings grouped look):
   label over its muted value on the left, a state-driven micro-preview on the
   right. Weight survives as ordering — identity first. (Per-cluster row
   heights were tried and reverted — uniform h-14 keeps the scan rhythm.)
   Tapping a row swaps panes instantly — control feedback, never gated on
   motion (slide/fade drill-ins were tried and dropped, Aug 2026).
   The chapter page has room, so the section body renders in its original
   form — hero inline at the head of its group. */

import { Fragment, useEffect, useRef, useState } from "react"
import { ChevronLeftIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { cn } from "@/registry/lib/utils"

import { CARD_DEMOS } from "./demos"
import { resolveIndex } from "./groups"
import type { IndexChapter } from "./groups"
import { PanelChrome } from "./panel"
import type { PanelSystem } from "./panel"
import { ControlGroup, GroupTitle, ROW_LABEL } from "./rows"
import { PanelSearch } from "./search"
import type { Chapter, Lab } from "./state"
import { isWired } from "./wired"

const PANE =
  "absolute inset-0 no-scrollbar flex flex-col overflow-y-auto overscroll-contain px-3 pt-[56px] pb-[64px] *:shrink-0"
/* Hidden panes stay mounted (the index keeps its scroll position) but go
   `inert` — invisible, unfocusable, and out of the accessibility tree. */
const PANE_HIDDEN = "opacity-0"

/** The not-wired-yet marker (issue #666) — drops per chapter via WIRED_CHAPTERS. */
function WipChip() {
  return (
    <span className="shrink-0 rounded-sm border border-border/60 px-1 py-px text-[9px] leading-none font-medium tracking-wide text-fg-muted/80 uppercase">
      wip
    </span>
  )
}

/* Index rows speak the same bg-muted row language as the chapter pages — no
   border, one panel surface behind them. Hover paints a translucent highlight
   OVER the whole card (::after sits on top of the demos too), not just the
   background behind them — the card lifts as one surface. */
const CARD =
  "relative h-14 w-full shrink-0 cursor-interactive rounded-lg bg-muted px-3.5 transition-colors focus-reset focus-visible:focus-ring after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-fg/5 after:opacity-0 after:transition-opacity hover:after:opacity-100 pressed:after:opacity-100"

function IndexRow({
  chapter,
  lab,
  compact,
  onPress,
}: {
  chapter: IndexChapter
  lab: Lab
  compact?: boolean
  onPress: () => void
}) {
  const status = lab.section(chapter.defaults)
  const Demo = CARD_DEMOS[chapter.id]
  const wip = !isWired(chapter.members.map((m) => m.id)) && <WipChip />
  // The label column: title (with its modified dot), and the live value
  // beneath it — first segment only, one word-ish.
  const label = (
    <span
      className={cn(
        "flex min-w-0 flex-col items-start gap-px",
        !compact && "w-24 shrink-0",
      )}
    >
      {/* No truncation: the title row may overflow the w-24 column into the
          slack before the demo strip, so the chip always sits right after
          the full title. */}
      <span className="flex items-center gap-2">
        <span className={cn(ROW_LABEL, "whitespace-nowrap")}>
          {chapter.label}
        </span>
        {status.modified && (
          <span
            aria-label="Modified"
            className="size-1 shrink-0 rounded-full bg-accent"
          />
        )}
        {wip}
      </span>
      <span className="max-w-full truncate text-xs text-fg-muted/60">
        {chapter.summary(lab.state).split(" · ")[0]}
      </span>
    </span>
  )
  // Compact: one line — title left, specimen right. For the set-and-forget
  // page-chrome rows; nothing crops, everything fits.
  if (compact)
    return (
      <RacButton
        data-row
        data-chapter={chapter.id}
        onPress={onPress}
        className={cn(CARD, "flex items-center gap-5")}
      >
        {label}
        <span className="ml-auto flex min-w-0 items-center gap-3">
          {Demo && (
            <span
              aria-hidden
              className="pointer-events-none flex shrink-0 items-center"
            >
              <Demo state={lab.state} />
            </span>
          )}
        </span>
      </RacButton>
    )

  // Label left, then the illustration strip. No chevron — tapping is the
  // only affordance the rows need.
  return (
    <RacButton
      data-row
      data-chapter={chapter.id}
      onPress={onPress}
      className={cn(CARD, "flex items-center gap-5 pr-0")}
    >
      {label}
      {/* A strip that FITS right-aligns (ml-auto) and centers (my-auto); one
          that OVERFLOWS collapses its auto margins and clips at the edges. */}
      {Demo && (
        <span
          aria-hidden
          className="pointer-events-none ml-auto flex h-full min-w-0 flex-1 overflow-hidden py-1.5"
        >
          <span className="my-auto ml-auto flex items-center gap-2 pr-3.5">
            <Demo state={lab.state} />
          </span>
        </span>
      )}
    </RacButton>
  )
}

export function DrillInPanel({
  chapters,
  lab,
  system,
}: {
  chapters: Chapter[]
  lab: Lab
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
      lab={lab}
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
            <ControlGroup key={i}>
              {group.chapters.map((chapter) => (
                <IndexRow
                  key={chapter.id}
                  chapter={chapter}
                  lab={lab}
                  compact={group.compact}
                  onPress={() => setActiveId(chapter.id)}
                />
              ))}
            </ControlGroup>
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
                  {!isWired(page.members.map((m) => m.id)) && <WipChip />}
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
                  <member.Body lab={lab} />
                </Fragment>
              ))}
            </>
          )}
        </div>
      </div>
    </PanelChrome>
  )
}
