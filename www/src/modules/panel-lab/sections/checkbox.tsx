"use client"

/* Checkbox — lead of the selection-control family (Checkbox ⇄ Radio ⇄ Switch),
   split into one chapter per control but synced on one look, the Button ⇄
   ToggleButton model. Fill is the family axis and lives here; Radio, Switch
   and Choice cards re-surface the same key. Accent is the brand-colored
   school — Material, Ant, Radix Themes color their checks with the brand;
   Neutral is the shadcn school — a near-black primary fill that inverts per
   mode, so it wears bg-fg with a bg-colored mark rather than any fixed dark
   token. Corner is checkbox-only geometry: Rounded ≈ shadcn's 4px, Square ≈
   Material/Carbon's 2px, Circle ≈ iOS-style list checks and Ant's circle
   checkbox — a radio is always a circle and a switch is always a pill, so
   the axis stops at the box. */

import { CheckIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import {
  ControlGroup,
  SegmentedControlRow,
  SelectRow,
} from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"

export const CHECKBOX_DEFAULTS = {
  checkFill: "accent",
  checkCorner: "rounded",
}

const FILL = {
  accent: {
    box: "bg-accent text-fg-on-accent",
    dot: "bg-fg-on-accent",
    track: "bg-accent",
    thumb: "bg-fg-on-accent",
  },
  neutral: {
    box: "bg-fg text-bg",
    dot: "bg-bg",
    track: "bg-fg",
    thumb: "bg-bg",
  },
}

export type CheckFill = (typeof FILL)[keyof typeof FILL]

export function fillOf(state: LabState): CheckFill {
  return FILL[state.checkFill as keyof typeof FILL]
}

const CORNER = {
  rounded: "rounded-[4px]",
  square: "rounded-[2px]",
  circle: "rounded-full",
}

export function checkboxCorner(state: LabState): string {
  return CORNER[state.checkCorner as keyof typeof CORNER]
}

/** The row grammar the family heroes share: a plain control-plus-label line. */
export const HERO_ROW = "flex items-center gap-2.5 text-[0.8125rem] text-fg"

/* ------------------------------ Option glyphs ------------------------------ */

/** A checkbox at one corner geometry; monochrome, like all glyphs. */
function CornerGlyph({ rx }: { rx: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx={rx}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m9 12.3 2.1 2.1 4-4.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* --------------------------------- Options --------------------------------- */

const FILL_OPTIONS = [
  { value: "accent", label: "Accent" },
  { value: "neutral", label: "Neutral" },
]

/** The family's synced axis, shown in each chapter — one key, one look. */
export function FillRow({ lab }: { lab: Lab }) {
  return (
    <SegmentedControlRow
      label="Fill"
      value={lab.state.checkFill}
      onChange={lab.set("checkFill")}
      options={FILL_OPTIONS}
    />
  )
}

const CORNER_OPTIONS: SelectRowOption[] = [
  {
    value: "rounded",
    label: "Rounded",
    illustration: <CornerGlyph rx={3.5} />,
  },
  { value: "square", label: "Square", illustration: <CornerGlyph rx={1} /> },
  { value: "circle", label: "Circle", illustration: <CornerGlyph rx={7} /> },
]

/* -------------------------------- Specimen --------------------------------- */

export function DemoCheckbox({
  checked,
  fill,
  corner,
}: {
  checked?: boolean
  fill: CheckFill
  corner: string
}) {
  return (
    <span
      className={cn(
        "flex size-4 shrink-0 items-center justify-center",
        corner,
        checked ? fill.box : "border border-border",
      )}
    >
      {checked && <CheckIcon className="size-3" strokeWidth={3} />}
    </span>
  )
}

/* ---------------------------------- Hero ----------------------------------- */

export function CheckboxHero({ state }: { state: LabState }) {
  const fill = fillOf(state)
  const corner = checkboxCorner(state)
  return (
    <Hero className="p-4">
      <label className={HERO_ROW}>
        <DemoCheckbox checked fill={fill} corner={corner} />
        I agree to the terms and conditions
      </label>
      <label className={HERO_ROW}>
        <DemoCheckbox fill={fill} corner={corner} />
        Subscribe to the newsletter
      </label>
    </Hero>
  )
}

/** Collapsed-row summary: the fill school, and the corner geometry. */
export function checkboxSummary(state: LabState): string {
  const fill =
    FILL_OPTIONS.find((o) => o.value === state.checkFill)?.label ??
    state.checkFill
  const corner =
    CORNER_OPTIONS.find((o) => o.value === state.checkCorner)?.label ??
    state.checkCorner
  return `${fill} fill · ${corner} corner`
}

export function CheckboxSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <CheckboxHero state={state} />
      <FillRow lab={lab} />
      <SelectRow
        label="Corner"
        value={state.checkCorner}
        onChange={set("checkCorner")}
        options={CORNER_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
