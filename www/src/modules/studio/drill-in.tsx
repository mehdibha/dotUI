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
import { Highlight, PanelSearch, matches } from "./search"
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
  compact,
  query = "",
  onPress,
}: {
  chapter: IndexChapter
  studio: Studio
  compact?: boolean
  /** The active search — highlights the hit in the label. */
  query?: string
  onPress: () => void
}) {
  const status = studio.section(chapter.defaults)
  const Demo = CARD_DEMOS[chapter.id]
  // The label column: title (with its modified dot), and the live value
  // beneath it — first segment only, one word-ish. A hit on an absorbed
  // member only ("toggle" → Buttons) shows that member there instead.
  const memberHits =
    query.trim() && !matches(chapter.label, query)
      ? chapter.members.filter((m) => matches(m.label, query))
      : []
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
          <Highlight text={chapter.label} query={query} />
        </span>
        {status.modified && (
          <span
            aria-label="Modified"
            className="size-1 shrink-0 rounded-full bg-accent"
          />
        )}
      </span>
      <span className="max-w-full truncate text-xs text-fg-muted/60">
        {memberHits.length > 0
          ? memberHits.map((m, i) => (
              <Fragment key={m.id}>
                {i > 0 && ", "}
                <Highlight text={m.label} query={query} />
              </Fragment>
            ))
          : chapter.summary(studio.state).split(" · ")[0]}
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
              <Demo state={studio.state} />
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

  // Search: null while closed. While open the index pane shows (over any
  // chapter page) and, once there's a query, filters down to the hits —
  // one flat group, chapters whose label or any member label matches.
  const [query, setQuery] = useState<string | null>(null)
  const searching = query !== null
  const hits = query?.trim()
    ? index.flatMap((group) =>
        group.chapters
          .filter(
            (chapter) =>
              matches(chapter.label, query) ||
              chapter.members.some((m) => matches(m.label, query)),
          )
          .map((chapter) => ({ chapter, compact: group.compact })),
      )
    : null

  function open(id: string) {
    setQuery(null)
    setActiveId(id)
  }

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
          query={query}
          onQueryChange={setQuery}
          onSubmit={() => {
            const first = hits?.[0]
            if (first) open(first.chapter.id)
          }}
          onFocusResults={() =>
            indexRef.current
              ?.querySelector<HTMLElement>("[data-chapter]")
              ?.focus()
          }
        />
      }
    >
      <div
        className="relative min-h-0 flex-1 overflow-hidden"
        onKeyDown={(event) => {
          // Escape on a focused result row closes the search too.
          if (event.key === "Escape" && searching) setQuery(null)
        }}
      >
        {/* Index pane. */}
        <div
          ref={indexRef}
          className={cn(PANE, "gap-3", page && !searching && PANE_HIDDEN)}
          inert={!!page && !searching}
        >
          {hits ? (
            hits.length > 0 ? (
              <ControlGroup>
                {hits.map(({ chapter, compact }) => (
                  <IndexRow
                    key={chapter.id}
                    chapter={chapter}
                    studio={studio}
                    compact={compact}
                    query={query ?? ""}
                    onPress={() => open(chapter.id)}
                  />
                ))}
              </ControlGroup>
            ) : (
              <p className="py-10 text-center text-sm text-fg-muted">
                No matching settings
              </p>
            )
          ) : (
            index.map((group, i) => (
              <ControlGroup key={i}>
                {group.chapters.map((chapter) => (
                  <IndexRow
                    key={chapter.id}
                    chapter={chapter}
                    studio={studio}
                    compact={group.compact}
                    onPress={() => open(chapter.id)}
                  />
                ))}
              </ControlGroup>
            ))
          )}
        </div>

        {/* Chapter page. */}
        <div
          ref={pageRef}
          className={cn(
            PANE,
            "gap-3 bg-card",
            (!page || searching) && PANE_HIDDEN,
          )}
          inert={!page || searching}
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
