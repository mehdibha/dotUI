"use client"

/* The chapter chrome: one bordered stack per section — the hero always
   visible, one collapsed row beneath it carrying the title and a live summary
   of the section's choices, the controls revealed on demand. No card heading;
   reset is global (panel header), never per-chapter. */

import { ChevronDownIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { Disclosure, DisclosurePanel } from "@/registry/ui/disclosure"
import { ROW_LABEL, ROW_VALUE } from "@/modules/control-lab/rows"

import { HeroFlushContext, PreviewModeContext } from "./hero"
import type { Chapter, Lab } from "./state"

/** One section as a stack: hero flush on top, an accordion row beneath it
 *  (title · live value summary · chevron), controls inside the panel. The body
 *  renders with heroes suppressed — the stack owns the specimen slot. */
export function ChapterStack({
  chapter: { label, defaults, Body, Hero, summary },
  lab,
}: {
  chapter: Chapter
  lab: Lab
}) {
  const status = lab.section(defaults)
  return (
    <section className="flex flex-col divide-y divide-border/45 overflow-hidden rounded-xl border border-border/45 bg-card">
      {Hero && (
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
          <span className="flex min-w-0 shrink-0 items-center gap-2">
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
    </section>
  )
}
