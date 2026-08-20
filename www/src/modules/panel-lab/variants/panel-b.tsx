"use client"

/* The drill-in panel — the chosen frame (Aug 2026). Two index sections only —
   Foundations, then Components (Templates planned). Rows are individual
   muted rows with a small gap, not fused lists: label over its muted value on
   the left, a small state-driven micro-preview and the chevron on the right.
   Tapping a row crossfades to the chapter page — a fast directional fade
   (12px of travel, strong ease-out, a touch of blur to mask the overlap),
   not a full-width push: this navigation fires constantly, so it stays
   subtle. The chapter page has room, so the section body renders in its
   original form — hero inline at the head of its group. Plain CSS
   transitions; view transitions freeze interactivity. */

import { Fragment, useEffect, useRef, useState } from "react"
import { ChevronLeftIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { cn } from "@/registry/lib/utils"
import { GroupTitle, ROW_LABEL } from "@/modules/control-lab/rows"

import { PanelChrome } from "../panel"
import type { Chapter, Lab } from "../state"
import { CARD_DEMOS } from "./demo"
import { resolveIndex } from "./groups"
import type { IndexChapter } from "./groups"

const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)"

/* Both panes share one crossfade: hidden = faded, nudged toward its exit
   side, slightly blurred. Movement drops under reduced motion; the fade
   stays. */
const PANE =
  "absolute inset-0 no-scrollbar flex flex-col overflow-y-auto overscroll-contain px-3 pt-[68px] pb-[68px] transition-[translate,opacity,filter] duration-200 *:shrink-0"
const PANE_HIDDEN = "pointer-events-none opacity-0 blur-[2px]"

/* Index rows speak the same bg-muted row language as the chapter pages — no
   border, one panel surface behind them. Hover paints a translucent highlight
   OVER the whole card (::after sits on top of the demos too), not just the
   background behind them — the card lifts as one surface. */
const CARD =
  "relative w-full shrink-0 cursor-interactive rounded-xl bg-muted px-4 py-3.5 transition-colors focus-reset focus-visible:focus-ring after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-fg/5 after:opacity-0 after:transition-opacity hover:after:opacity-100 pressed:after:opacity-100"

function IndexRow({
  chapter,
  lab,
  onPress,
}: {
  chapter: IndexChapter
  lab: Lab
  onPress: () => void
}) {
  const status = lab.section(chapter.defaults)
  const Demo = CARD_DEMOS[chapter.id]

  // The info line under the title: composites list what they contain (the
  // merged names stay findable); plain chapters show their live values.
  const subline =
    chapter.members.length > 1
      ? chapter.members
          .slice(chapter.hostless ? 0 : 1)
          .map((member) => member.label)
          .join(" · ")
      : (chapter.members[0]?.summary(lab.state) ?? "")

  // Label left (title over its info line), then a strip of real specimens.
  // No chevron — the specimen and the info line carry the values.
  return (
    <RacButton
      onPress={onPress}
      className={cn(CARD, "flex h-16 items-center gap-3 py-0 pr-0")}
    >
      {/* Fixed label column so strips align; both lines truncate. */}
      <span className="flex w-32 shrink-0 flex-col items-start gap-0.5">
        <span className="flex w-full items-center gap-2">
          <span className={ROW_LABEL}>{chapter.label}</span>
          {status.modified && (
            <span
              aria-label="Modified"
              className="size-1 shrink-0 rounded-full bg-accent"
            />
          )}
        </span>
        <span className="w-full truncate text-start text-xs text-fg-muted">
          {subline}
        </span>
      </span>
      {/* Uniform paddings via auto margins: a strip that FITS right-aligns
          (ml-auto) at the card's pr-4 and vertically centers (my-auto); one
          that OVERFLOWS collapses its auto margins to 0, so it pins to the
          card's pt-3.5 / left edge and crops through the bottom / the 16px
          right fade, which starts exactly where the padding begins. */}
      <span
        aria-hidden
        className="pointer-events-none flex h-full min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_left,transparent,black_16px)] py-3.5"
      >
        <span className="my-auto ml-auto flex items-center gap-2 pr-4">
          {Demo && <Demo state={lab.state} />}
        </span>
      </span>
    </RacButton>
  )
}

export function PanelB({ chapters, lab }: { chapters: Chapter[]; lab: Lab }) {
  const index = resolveIndex(chapters)
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
    <PanelChrome lab={lab}>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* Index pane — fades out with a small leftward nudge. */}
        <div
          className={cn(
            PANE,
            "gap-5",
            active &&
              cn(PANE_HIDDEN, "-translate-x-3 motion-reduce:translate-x-0"),
          )}
          style={{ transitionTimingFunction: EASE_OUT }}
          aria-hidden={!!active}
        >
          {index.map((group) => (
            <section key={group.label} className="flex flex-col gap-1.5">
              <span className="px-1 text-xs font-medium text-fg-muted">
                {group.label}
              </span>
              <div className="flex flex-col gap-1.5">
                {group.chapters.map((chapter) => (
                  <IndexRow
                    key={chapter.id}
                    chapter={chapter}
                    lab={lab}
                    onPress={() => setActiveId(chapter.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Chapter page — fades in from a small rightward nudge. */}
        <div
          ref={pageRef}
          className={cn(
            PANE,
            "gap-[var(--lab-gap-control,0.375rem)] bg-card",
            !active &&
              cn(PANE_HIDDEN, "translate-x-3 motion-reduce:translate-x-0"),
          )}
          style={{ transitionTimingFunction: EASE_OUT }}
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
