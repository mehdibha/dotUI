"use client"

/* The drill-in panel — the chosen frame (Aug 2026). Two index sections only —
   Foundations, then Components (Templates planned). Rows are individual
   cards with a small gap, not fused lists: label over its muted value on the
   left, a small state-driven micro-preview and the chevron on the right.
   Tapping a row pushes the chapter in from the right, iOS-style, with a back
   header; the chapter page has room, so the section body renders in its
   original form — hero inline at the head of its group. Plain transform
   transitions; view transitions freeze interactivity. */

import { useRef, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { cn } from "@/registry/lib/utils"
import { ROW_LABEL } from "@/modules/control-lab/rows"

import { PanelChrome } from "../panel"
import type { Chapter, Lab } from "../state"
import { ChapterChip } from "./chip"
import { CARD_DEMOS } from "./demo"
import { resolveGroups, SECTIONS } from "./groups"

const PUSH_EASE = "cubic-bezier(0.32, 0.72, 0, 1)"

/* Hover paints a translucent highlight OVER the whole card (::after sits on
   top of the demos too), not just the background behind them — the card
   lifts as one surface. */
const CARD =
  "relative w-full shrink-0 cursor-interactive rounded-xl border border-border/45 bg-card px-4 py-3.5 transition-colors focus-reset focus-visible:focus-ring hover:border-border/80 pressed:border-border/80 after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-fg/5 after:opacity-0 after:transition-opacity hover:after:opacity-100 pressed:after:opacity-100"

/* Chapters absorbed by another chapter's page: their row leaves the index,
   their body renders after the host's, and the host's modified dot covers
   their axes too. */
const MERGED: Record<string, string[]> = {
  inputs: ["input-groups"],
}

function mergedDefaults(chapter: Chapter, chapters: Chapter[]) {
  const extra = (MERGED[chapter.id] ?? [])
    .map((id) => chapters.find((c) => c.id === id)?.defaults)
    .filter(Boolean)
  return Object.assign({}, chapter.defaults, ...extra)
}

function IndexRow({
  chapter,
  chapters,
  lab,
  onPress,
}: {
  chapter: Chapter
  chapters: Chapter[]
  lab: Lab
  onPress: () => void
}) {
  const status = lab.section(mergedDefaults(chapter, chapters))
  const Demo = CARD_DEMOS[chapter.id]

  const heading = (
    <span className="flex items-center gap-2">
      <span className={ROW_LABEL}>{chapter.label}</span>
      {status.modified && (
        <span
          aria-label="Modified"
          className="size-1 shrink-0 rounded-full bg-accent"
        />
      )}
    </span>
  )

  // Demo cards: label left, then a strip of real specimens that bleeds off
  // the card's right edge and fades out there — the leftmost (identity)
  // specimen stays fully visible, the rest give a cropped quick look. No
  // chevron: the whole card is the affordance.
  if (Demo) {
    return (
      <RacButton
        onPress={onPress}
        className={cn(CARD, "flex h-16 items-center gap-3 py-0 pr-0")}
      >
        {/* Fixed label column so every card's demo strip starts at the same x. */}
        <span className="w-28 shrink-0 overflow-hidden">{heading}</span>
        <span
          aria-hidden
          className="pointer-events-none flex h-full min-w-0 flex-1 items-center justify-start gap-2 overflow-hidden [mask-image:linear-gradient(to_left,transparent,black_32px)]"
        >
          <Demo state={lab.state} />
        </span>
      </RacButton>
    )
  }

  return (
    <RacButton
      onPress={onPress}
      className={cn(CARD, "flex items-center justify-between gap-3")}
    >
      <span className="flex min-w-0 flex-col items-start gap-0.5">
        {heading}
        <span className="truncate text-xs text-fg-muted">
          {chapter.summary(lab.state)}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2.5">
        <ChapterChip id={chapter.id} state={lab.state} />
        <ChevronRightIcon className="size-3.5 shrink-0 text-fg-muted" />
      </span>
    </RacButton>
  )
}

export function PanelB({ chapters, lab }: { chapters: Chapter[]; lab: Lab }) {
  const [activeId, setActiveId] = useState<string | null>(null)
  // The page keeps rendering its last chapter while sliding back out.
  const lastRef = useRef<Chapter | null>(null)
  const active = chapters.find((chapter) => chapter.id === activeId) ?? null
  if (active) lastRef.current = active
  const page = active ?? lastRef.current

  return (
    <PanelChrome lab={lab}>
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl">
        {/* Index pane — recedes left under the incoming page. */}
        <div
          className={cn(
            "absolute inset-0 no-scrollbar flex flex-col gap-5 overflow-y-auto overscroll-contain pt-[60px] pb-[66px] transition-[transform,opacity] duration-350 *:shrink-0",
            active && "pointer-events-none -translate-x-1/4 opacity-60",
          )}
          style={{ transitionTimingFunction: PUSH_EASE }}
          aria-hidden={!!active}
        >
          {resolveGroups(SECTIONS, chapters).map((group) => (
            <section key={group.label} className="flex flex-col gap-1.5">
              <span className="px-1 text-xs font-medium text-fg-muted">
                {group.label}
              </span>
              <div className="flex flex-col gap-1.5">
                {group.chapters.map((chapter) => (
                  <IndexRow
                    key={chapter.id}
                    chapter={chapter}
                    chapters={chapters}
                    lab={lab}
                    onPress={() => setActiveId(chapter.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Chapter page — slides in from the right. */}
        <div
          className={cn(
            "absolute inset-0 no-scrollbar flex flex-col gap-[var(--lab-gap-control,0.375rem)] overflow-y-auto overscroll-contain bg-bg pt-[60px] pb-[66px] transition-transform duration-350 *:shrink-0",
            active ? "translate-x-0" : "pointer-events-none translate-x-full",
          )}
          style={{ transitionTimingFunction: PUSH_EASE }}
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
              <page.Body lab={lab} />
              {(MERGED[page.id] ?? []).map((id) => {
                const merged = chapters.find((c) => c.id === id)
                return merged ? <merged.Body key={id} lab={lab} /> : null
              })}
            </>
          )}
        </div>
      </div>
    </PanelChrome>
  )
}
