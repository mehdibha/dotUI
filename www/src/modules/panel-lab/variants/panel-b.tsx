"use client"

/* Variant B — drill-in. The top level is a compact grouped index (Identity
   first, then families); tapping a row pushes the chapter in from the right,
   iOS-style, with a back header. The chapter page has room, so the section
   body renders in its original form — hero inline at the head of its group.
   Plain transform transitions; view transitions freeze interactivity. */

import { useRef, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { cn } from "@/registry/lib/utils"
import { ROW_LABEL, ROW_VALUE } from "@/modules/control-lab/rows"
import { useTweak } from "@/dev/tweaker"

import { PanelChrome } from "../panel"
import type { Chapter, Lab } from "../state"
import { ChapterChip } from "./chip"
import { groupChapters, IDENTITY_IDS } from "./groups"
import type { RowVisual } from "./panel-a"

const PUSH_EASE = "cubic-bezier(0.32, 0.72, 0, 1)"

function IndexRow({
  chapter,
  lab,
  visual,
  onPress,
}: {
  chapter: Chapter
  lab: Lab
  visual: RowVisual
  onPress: () => void
}) {
  const status = lab.section(chapter.defaults)
  const identity = IDENTITY_IDS.includes(chapter.id)
  return (
    <RacButton
      onPress={onPress}
      className="flex h-11 w-full shrink-0 cursor-interactive items-center justify-between gap-3 px-3.5 focus-reset transition-colors hover:bg-highlight focus-visible:focus-ring pressed:bg-highlight"
    >
      <span className="flex min-w-0 shrink-0 items-center gap-2.5">
        {visual !== "text" && identity && (
          <ChapterChip id={chapter.id} state={lab.state} />
        )}
        <span className={ROW_LABEL}>{chapter.label}</span>
        {status.modified && (
          <span
            aria-label="Modified"
            className="size-1 shrink-0 rounded-full bg-accent"
          />
        )}
      </span>
      <span className="flex min-w-0 items-center gap-1.5">
        <span className={ROW_VALUE}>{chapter.summary(lab.state)}</span>
        <ChevronRightIcon className="size-3.5 shrink-0 text-fg-muted" />
      </span>
    </RacButton>
  )
}

export function PanelB({ chapters, lab }: { chapters: Chapter[]; lab: Lab }) {
  // Same tweak key as variant A — one control drives both panels.
  const visual = useTweak("Row visual", {
    type: "select",
    options: ["chip", "hero", "text"],
    default: "chip",
    group: "Variants",
  }) as RowVisual

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
          {groupChapters(chapters).map((group) => (
            <section key={group.label} className="flex flex-col gap-1.5">
              <span className="px-1 text-xs font-medium text-fg-muted">
                {group.label}
              </span>
              <div className="flex flex-col divide-y divide-border/45 overflow-hidden rounded-xl border border-border/45 bg-card">
                {group.chapters.map((chapter) => (
                  <IndexRow
                    key={chapter.id}
                    chapter={chapter}
                    lab={lab}
                    visual={visual}
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
            </>
          )}
        </div>
      </div>
    </PanelChrome>
  )
}
