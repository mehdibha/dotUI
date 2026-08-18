"use client"

/* Popovers — the anchored panel's own decisions, past what Surfaces
   (elevation), Menus (items) and Motion (entrance) already own. Two axes
   from a 22-system survey (2026-08). Tip: the arrow pointing at the
   trigger — mandatory in Cloudscape, default in Ant, Bootstrap, Apple and
   styled Spectrum; absent in shadcn, Radix Themes, M3 (never), Fluent,
   Polaris, Linear — and Primer's newer AnchoredOverlay drops its classic
   caret, so arrowless is the modern default. Tooltips arrow independently:
   every styled system with both arrows the tooltip and flattens the popover,
   so the tooltip's tip is its own axis, never synced. Header: how a popover
   titles itself — freeform content (Radix Themes, Mantine, Polaris), a plain
   title + muted description (shadcn v4 PopoverHeader, Base UI), or a tinted
   divided band (Bootstrap popover-header, Ant title). Rejected: close X
   (Cloudscape is the lone default-on; everywhere else light-dismiss), offset
   (0–8px cluster — recipe constant), popover→sheet on mobile (real split,
   Apple/Spectrum vs the anchored web, but a system-wide adaptive decision
   the panel can't preview honestly). */

import { ChevronDownIcon } from "lucide-react"

import { ControlGroup, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const POPOVER_DEFAULTS = {
  popoverTip: "none",
  popoverHeader: "title",
}

/* ------------------------------ Option glyphs ------------------------------ */

/** The panel over the trigger it's anchored to, with or without the tip. */
function TipGlyph({ tip }: { tip?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="16"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 8h10M7 11h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".45"
      />
      {tip && <path d="M10.3 14.7 12 17.2l1.7-2.5Z" fill="currentColor" />}
      <path
        d="M9 20.5h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  )
}

/** The panel's title treatment: freeform lines, a leading title, or a band. */
function HeaderGlyph({ header }: { header: "none" | "title" | "band" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="4.5"
        width="16"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {header === "band" && (
        <>
          <path d="M5.5 6.25h13v3h-13z" fill="currentColor" opacity=".15" />
          <path d="M4 10.5h16" stroke="currentColor" strokeWidth="1" />
        </>
      )}
      <path
        d={header === "none" ? "M7 8.5h10" : "M7 8h7"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={header === "none" ? 0.45 : 1}
      />
      <path
        d="M7 13h10M7 16h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  )
}

/* --------------------------------- Options --------------------------------- */

const TIP_OPTIONS: SelectRowOption[] = [
  { value: "none", label: "None", illustration: <TipGlyph /> },
  { value: "tip", label: "Tip", illustration: <TipGlyph tip /> },
]

const HEADER_OPTIONS: SelectRowOption[] = [
  {
    value: "none",
    label: "Freeform",
    illustration: <HeaderGlyph header="none" />,
  },
  {
    value: "title",
    label: "Title",
    illustration: <HeaderGlyph header="title" />,
  },
  { value: "band", label: "Band", illustration: <HeaderGlyph header="band" /> },
]

/* ---------------------------------- Hero ----------------------------------- */

function PopoversHero({ state }: { state: LabState }) {
  const header = state.popoverHeader
  const title = "Share project"
  const description = "Anyone with the link can view."
  return (
    <Hero className="items-center py-4">
      <div className="flex flex-col items-center gap-1.5">
        <span className="flex h-6 items-center gap-1 rounded-md border border-border/60 bg-card px-2 text-xs font-medium text-fg">
          Share
          <ChevronDownIcon className="size-3 text-fg-muted" />
        </span>
        <div className="relative w-48 rounded-lg border border-border/60 bg-card text-[0.8125rem] shadow-lg">
          {state.popoverTip === "tip" && (
            <span className="absolute -top-[4.5px] left-1/2 size-2 -translate-x-1/2 rotate-45 rounded-[1px] border-t border-l border-border/60 bg-card" />
          )}
          {header === "band" && (
            <div className="rounded-t-lg border-b border-border/60 bg-muted/50 px-3 py-1.5 font-medium text-fg">
              {title}
            </div>
          )}
          <div className="flex flex-col gap-1 p-3">
            {header === "title" && (
              <span className="font-medium text-fg">{title}</span>
            )}
            <span className="text-xs text-fg-muted">{description}</span>
            <span className="mt-1 h-6 rounded-md border border-border/60 bg-bg" />
          </div>
        </div>
      </div>
    </Hero>
  )
}

export function PopoversSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <PopoversHero state={state} />
      <SelectRow
        label="Tip"
        value={state.popoverTip}
        onChange={set("popoverTip")}
        options={TIP_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="Header"
        value={state.popoverHeader}
        onChange={set("popoverHeader")}
        options={HEADER_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
