"use client"

/* Radio — the selection-control family's single-choice member. It has no
   geometry of its own (a radio is always a circle) so its only axis is the
   family's synced Fill, owned by the Checkbox chapter. */

import { cn } from "@/registry/lib/utils"

import { Hero } from "../hero"
import { ControlGroup } from "../rows"
import type { Lab, LabState } from "../state"
import { FillRow, fillOf, HERO_ROW } from "./checkbox"
import type { CheckFill } from "./checkbox"

export const RADIO_DEFAULTS = {
  checkFill: "accent",
}

/* -------------------------------- Specimen --------------------------------- */

export function DemoRadio({
  selected,
  fill,
}: {
  selected?: boolean
  fill: CheckFill
}) {
  return (
    <span
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded-full",
        selected ? fill.box : "border border-border",
      )}
    >
      {selected && <span className={cn("size-1.5 rounded-full", fill.dot)} />}
    </span>
  )
}

/* ---------------------------------- Hero ----------------------------------- */

export function RadioHero({ state }: { state: LabState }) {
  const fill = fillOf(state)
  return (
    <Hero className="p-4">
      <span className="text-xs font-medium text-fg-muted">Export format</span>
      <label className={HERO_ROW}>
        <DemoRadio selected fill={fill} />
        PNG
      </label>
      <label className={HERO_ROW}>
        <DemoRadio fill={fill} />
        SVG
      </label>
      <label className={HERO_ROW}>
        <DemoRadio fill={fill} />
        PDF
      </label>
    </Hero>
  )
}

/** Collapsed-row summary: the family fill school, the section's one axis. */
export function radioSummary(state: LabState): string {
  return state.checkFill === "neutral" ? "Neutral fill" : "Accent fill"
}

export function RadioSection({ lab }: { lab: Lab }) {
  return (
    <ControlGroup>
      <RadioHero state={lab.state} />
      <FillRow lab={lab} />
    </ControlGroup>
  )
}
