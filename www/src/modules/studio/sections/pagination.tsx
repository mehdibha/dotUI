"use client"

/* Pagination — a Buttons follower: page items wear the family's quiet button
   language (radius, hover, press all inherit Buttons). One own axis.
   Current-page emphasis: filled (Primer solid accent, GOV.UK solid block,
   MUI selected) vs outline (shadcn isActive → outline variant, Ant bordered
   white). Rejected: numbered vs prev/next-only is a prop (Ant `simple`;
   Polaris and Carbon simply never number); prev/next labels are content;
   item shape, hover, press and radius inherit Buttons. */

import { CURRENT_OPTIONS as CURRENT_VALUES } from "../axes/pagination"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

function CurrentGlyph({ emphasis }: { emphasis: "filled" | "outline" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="4" cy="12" r="1.5" fill="currentColor" opacity=".4" />
      <circle cx="20" cy="12" r="1.5" fill="currentColor" opacity=".4" />
      {emphasis === "filled" ? (
        <rect
          x="7.5"
          y="7.5"
          width="9"
          height="9"
          rx="2.5"
          fill="currentColor"
        />
      ) : (
        <rect
          x="8.25"
          y="8.25"
          width="7.5"
          height="7.5"
          rx="2.25"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
    </svg>
  )
}

const CURRENT_OPTIONS: SelectRowOption[] = CURRENT_VALUES.map((option) => ({
  ...option,
  illustration: (
    <CurrentGlyph emphasis={option.value as "filled" | "outline"} />
  ),
}))

export function PaginationSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Current page"
        value={state.paginationCurrent}
        onChange={set("paginationCurrent")}
        options={CURRENT_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
