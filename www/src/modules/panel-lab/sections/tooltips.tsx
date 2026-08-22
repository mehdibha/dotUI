"use client"

/* Tooltips — a surface decision of its own, not a copy of the dialog's:
   shadcn, Radix and GitHub invert to a near-black chip (bg-tooltip); MUI's
   gray and Linear's bordered card keep the tooltip on a surface with a
   hairline. The hero pins the chip to the icon-button it names. */

import { CopyIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { ControlGroup, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const TOOLTIP_DEFAULTS = {
  tooltipStyle: "inverted",
}

export const TOOLTIP = {
  inverted: "bg-tooltip text-fg-on-tooltip",
  surface: "border border-border bg-card text-fg shadow-sm",
}

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

const TOOLTIP_OPTIONS: SelectRowOption[] = [
  {
    value: "inverted",
    label: "Inverted",
    illustration: <TooltipGlyph filled />,
  },
  { value: "surface", label: "Surface", illustration: <TooltipGlyph /> },
]

/* ---------------------------------- Hero ----------------------------------- */

export function TooltipsHero({ state }: { state: LabState }) {
  return (
    <Hero className="h-24 items-center justify-center">
      <div className="flex flex-col items-center gap-1.5">
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-[0.6875rem] font-medium",
            TOOLTIP[state.tooltipStyle as keyof typeof TOOLTIP],
          )}
        >
          Copy
        </span>
        <span className="flex size-6 items-center justify-center rounded-md border border-border/60 bg-card">
          <CopyIcon className="size-3 text-fg-muted" />
        </span>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the tooltip surface style. */
export function tooltipsSummary(state: LabState): string {
  return (
    TOOLTIP_OPTIONS.find((o) => o.value === state.tooltipStyle)?.label ??
    state.tooltipStyle
  )
}

export function TooltipsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <TooltipsHero state={state} />
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
