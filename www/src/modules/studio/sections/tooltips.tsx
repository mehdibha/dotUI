"use client"

/* Tooltips — a surface decision of its own, not a copy of the dialog's:
   shadcn, Radix and GitHub invert to a near-black chip (bg-tooltip); MUI's
   gray and Linear's bordered card keep the tooltip on a surface with a
   hairline. */

import { TOOLTIP_STYLE_OPTIONS } from "../axes/tooltips"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

/** The chip with its caret, over the thing it names. */
function TooltipGlyph({ filled }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="5.5"
        width="14"
        height="7"
        rx="2"
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth="1.5"
      />
      <path
        d="M10.3 12.5 12 15l1.7-2.5Z"
        fill="currentColor"
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={filled ? 0 : 1.5}
        strokeLinejoin="round"
      />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" opacity=".45" />
    </svg>
  )
}

/* --------------------------------- Options --------------------------------- */

const TOOLTIP_OPTIONS: SelectRowOption[] = TOOLTIP_STYLE_OPTIONS.map((o) => ({
  ...o,
  illustration: <TooltipGlyph filled={o.value === "inverted"} />,
}))

export function TooltipsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Style"
        value={state.tooltipStyle}
        onChange={set("tooltipStyle")}
        options={TOOLTIP_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
