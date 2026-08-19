"use client"

/* Variant A — structured scroll. One grouped list: Identity first, then the
   refinement families, each group a captioned single surface with hairline
   dividers. Rows expand in place; the row visual (chip / hero / text) is a
   tweak so all three answers to the spec's open question are testable live.
   Heroes never render inside expanded bodies — the stack owns the specimen
   slot only when the tweak says so, and only for identity chapters. */

import { ChevronDownIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { Disclosure, DisclosurePanel } from "@/registry/ui/disclosure"
import { ROW_LABEL, ROW_VALUE } from "@/modules/control-lab/rows"
import { useTweak } from "@/dev/tweaker"

import { HeroFlushContext, PreviewModeContext } from "../hero"
import { PanelChrome } from "../panel"
import type { Chapter, Lab } from "../state"
import { ChapterChip } from "./chip"
import { groupChapters, IDENTITY_IDS } from "./groups"

export type RowVisual = "chip" | "hero" | "text"

function ChapterRow({
  chapter,
  lab,
  visual,
}: {
  chapter: Chapter
  lab: Lab
  visual: RowVisual
}) {
  const { label, defaults, Body, Hero, summary } = chapter
  const status = lab.section(defaults)
  const identity = IDENTITY_IDS.includes(chapter.id)
  const showHero = visual === "hero" && identity && Hero
  return (
    <div className="flex flex-col">
      {showHero && (
        <PreviewModeContext.Provider value="hero">
          <HeroFlushContext.Provider value={true}>
            <Hero state={lab.state} />
          </HeroFlushContext.Provider>
        </PreviewModeContext.Provider>
      )}
      <Disclosure className="flex flex-col">
        <RacButton
          slot="trigger"
          className="flex h-11 shrink-0 cursor-interactive items-center justify-between gap-3 px-3.5 focus-reset transition-colors hover:bg-highlight focus-visible:focus-ring pressed:bg-highlight"
        >
          <span className="flex min-w-0 shrink-0 items-center gap-2.5">
            {visual === "chip" && identity && (
              <ChapterChip id={chapter.id} state={lab.state} />
            )}
            <span className={ROW_LABEL}>{label}</span>
            {status.modified && (
              <span
                aria-label="Modified"
                className="size-1 shrink-0 rounded-full bg-accent"
              />
            )}
          </span>
          <span className="flex min-w-0 items-center gap-1.5">
            <span className={ROW_VALUE}>{summary(lab.state)}</span>
            <ChevronDownIcon className="size-3.5 shrink-0 text-fg-muted transition-transform duration-200 group-expanded/disclosure:rotate-180" />
          </span>
        </RacButton>
        <DisclosurePanel className="text-inherit">
          <div className="flex flex-col gap-[var(--lab-gap-control,0.375rem)] px-2 pb-2">
            <PreviewModeContext.Provider value="none">
              <Body lab={lab} />
            </PreviewModeContext.Provider>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  )
}

export function PanelA({ chapters, lab }: { chapters: Chapter[]; lab: Lab }) {
  const visual = useTweak("Row visual", {
    type: "select",
    options: ["chip", "hero", "text"],
    default: "chip",
    group: "Variants",
  }) as RowVisual

  return (
    <PanelChrome lab={lab}>
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain rounded-xl pt-[60px] pb-[66px] *:shrink-0">
        {groupChapters(chapters).map((group) => (
          <section key={group.label} className="flex flex-col gap-1.5">
            <span className="px-1 text-xs font-medium text-fg-muted">
              {group.label}
            </span>
            <div className="flex flex-col divide-y divide-border/45 overflow-hidden rounded-xl border border-border/45 bg-card">
              {group.chapters.map((chapter) => (
                <ChapterRow
                  key={chapter.id}
                  chapter={chapter}
                  lab={lab}
                  visual={visual}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PanelChrome>
  )
}
