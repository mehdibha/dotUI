"use client"

/* The drill-in panel — the chosen frame (Aug 2026). The index is a run of
   UNTITLED family clusters — each fuses its rows into one ControlGroup card,
   and the gaps alone carry the structure (the iOS-Settings grouped look):
   label over its muted value on the left, a state-driven micro-preview on the
   right. Weight survives as ordering — identity first. (Per-cluster row
   heights were tried and reverted — uniform h-16 keeps the scan rhythm.)
   Tapping a row animates entry-only (the Design System Builder mock, Aug
   2026): the incoming pane fades in over a 20px slide — from the right
   drilling in, from the left coming back — 220ms cubic-bezier(.2,.7,.3,1);
   the outgoing pane swaps out instantly, so motion never gates input.
   The chapter page has room, so the section body renders in its original
   form — hero inline at the head of its group. */

import { Fragment, useEffect, useRef, useState } from "react"
import { ChevronLeftIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { cn } from "@/registry/lib/utils"
import { ControlGroup, GroupTitle, ROW_LABEL } from "@/modules/control-lab/rows"
import { useTweak } from "@/dev/tweaker"

import { PanelChrome } from "../panel"
import type { PanelSystem } from "../panel"
import { PanelSearch } from "../search"
import type { Chapter, Lab } from "../state"
import { CARD_DEMOS } from "./demo"
import { resolveIndex } from "./groups"
import type { IndexChapter } from "./groups"

const PANE =
  "absolute inset-0 no-scrollbar flex flex-col overflow-y-auto overscroll-contain px-3 pt-[56px] pb-[64px] *:shrink-0"
/* Entry-only motion: a visible pane transitions opacity+transform in; a
   hidden one snaps out (transition-none) so the swap never overlaps. The
   hidden offset sets where the pane enters FROM next time it shows —
   the index re-enters from the left (back), the page from the right
   (drill-in). First paint renders the visible classes directly, so
   nothing animates on mount. `fade` leaves the offset out of the
   transition so only opacity eases; `instant` transitions nothing. */
const PANE_SHOWN: Record<string, string> = {
  slide:
    "translate-x-0 opacity-100 transition-[opacity,translate] duration-[220ms] ease-[cubic-bezier(.2,.7,.3,1)] motion-reduce:transition-none",
  fade: "translate-x-0 opacity-100 transition-opacity duration-[220ms] ease-[cubic-bezier(.2,.7,.3,1)] motion-reduce:transition-none",
  instant: "translate-x-0 opacity-100",
}
const PANE_HIDDEN = "pointer-events-none opacity-0 transition-none"

/* Index rows speak the same bg-muted row language as the chapter pages — no
   border, one panel surface behind them. Hover paints a translucent highlight
   OVER the whole card (::after sits on top of the demos too), not just the
   background behind them — the card lifts as one surface. */
const CARD =
  "relative w-full shrink-0 cursor-interactive rounded-lg bg-muted px-3.5 py-3 transition-colors focus-reset focus-visible:focus-ring after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-fg/5 after:opacity-0 after:transition-opacity hover:after:opacity-100 pressed:after:opacity-100"

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
  // The label column: title (with its modified dot), and the live value
  // beneath it — first segment only, one word-ish.
  const label = (
    <span
      className={cn(
        "flex min-w-0 flex-col items-start gap-px",
        !compact && "w-24 shrink-0",
      )}
    >
      <span className="flex max-w-full items-center gap-2">
        <span className={cn(ROW_LABEL, "truncate")}>{chapter.label}</span>
        {status.modified && (
          <span
            aria-label="Modified"
            className="size-1 shrink-0 rounded-full bg-accent"
          />
        )}
      </span>
      <span className="max-w-full truncate text-xs text-fg-muted/60">
        {chapter.summary(lab.state).split(" · ")[0]}
      </span>
    </span>
  )
  const height = "h-14"

  // Compact: one line — title left, specimen right. For the set-and-forget
  // page-chrome rows; nothing crops, everything fits.
  if (compact)
    return (
      <RacButton
        data-row
        onPress={onPress}
        className={cn(CARD, height, "flex items-center gap-5 py-0")}
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
      onPress={onPress}
      className={cn(CARD, height, "flex items-center gap-5 py-0 pr-0")}
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

export function PanelB({
  chapters,
  lab,
  system,
}: {
  chapters: Chapter[]
  lab: Lab
  system?: PanelSystem
}) {
  const index = resolveIndex(chapters)
  const drillIn = useTweak("Drill-in", {
    type: "select",
    options: ["slide", "fade", "instant"],
    default: "slide",
    group: "Motion",
  })
  const shown = PANE_SHOWN[drillIn] ?? PANE_SHOWN.slide
  const [activeId, setActiveId] = useState<string | null>(null)
  // The page keeps rendering its last chapter while sliding back out.
  const lastRef = useRef<IndexChapter | null>(null)
  const active =
    index
      .flatMap((group) => group.chapters)
      .find((chapter) => chapter.id === activeId) ?? null
  if (active) lastRef.current = active
  const page = active ?? lastRef.current

  // The page pane is one persistent scroller — start each chapter at its top.
  const pageRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (activeId && pageRef.current) pageRef.current.scrollTop = 0
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
          className={cn(
            PANE,
            "gap-3",
            active ? cn(PANE_HIDDEN, "-translate-x-5") : shown,
          )}
          aria-hidden={!!active}
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
          className={cn(
            PANE,
            "gap-3 bg-card",
            active ? shown : cn(PANE_HIDDEN, "translate-x-5"),
          )}
          aria-hidden={!active}
        >
          {page && (
            <>
              <div className="mb-1 flex h-8 items-center gap-1">
                <RacButton
                  onPress={() => setActiveId(null)}
                  className="flex h-8 cursor-interactive items-center gap-1 rounded-lg pr-2.5 pl-1.5 text-[0.8125rem] text-fg-muted focus-reset transition-colors hover:bg-highlight hover:text-fg focus-visible:focus-ring pressed:bg-highlight"
                >
                  <ChevronLeftIcon className="size-4" />
                  All settings
                </RacButton>
                <span className="ml-auto pr-1 text-[0.8125rem] font-medium text-fg">
                  {page.label}
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
