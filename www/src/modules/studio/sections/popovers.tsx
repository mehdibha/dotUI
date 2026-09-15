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
   divided band (Bootstrap popover-header, Ant title) — freeform content is
   how a popover is composed, not styled, so it isn't an option. Rejected: close X
   (Cloudscape is the lone default-on; everywhere else light-dismiss), offset
   (0–8px cluster — recipe constant), popover→sheet on mobile (real split,
   Apple/Spectrum vs the anchored web, but a system-wide adaptive decision
   the panel can't preview honestly). */

import { HEADER_OPTIONS, TIP_OPTIONS } from "../axes/popovers"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

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

/** The panel's title treatment: a leading title, or a band. */
function HeaderGlyph({ header }: { header: "title" | "band" }) {
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
        d="M7 8h7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
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

const TIP_ROW_OPTIONS: SelectRowOption[] = TIP_OPTIONS.map((o) => ({
  ...o,
  illustration: <TipGlyph tip={o.value === "tip"} />,
}))

const HEADER_ROW_OPTIONS: SelectRowOption[] = HEADER_OPTIONS.map((o) => ({
  ...o,
  illustration: <HeaderGlyph header={o.value as "title" | "band"} />,
}))

export function PopoversSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Tip"
        value={state.popoverTip}
        onChange={set("popoverTip")}
        options={TIP_ROW_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="Header"
        value={state.popoverHeader}
        onChange={set("popoverHeader")}
        options={HEADER_ROW_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
