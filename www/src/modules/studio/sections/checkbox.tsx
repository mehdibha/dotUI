"use client"

/* Checkbox — lead of the selection-control family (Checkbox ⇄ Radio ⇄ Switch),
   one chapter per control. Color is per control, a leaf of Color's Primary.
   A radio is always a circle and a switch is always a pill, so Corner stops
   at the box. */

import { CORNER_OPTIONS } from "../axes/checkbox"
import { SOURCE_OPTIONS } from "../axes/color"
import { ControlGroup, SegmentedControlRow, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

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

/** One control's color — the same leaf Color's Primary row shows. */
export function FillRow({
  studio,
  field,
}: {
  studio: Studio
  field: "checkboxColor" | "radioColor" | "switchColor"
}) {
  return (
    <SegmentedControlRow
      label="Color"
      value={studio.state[field]}
      onChange={studio.set(field)}
      options={SOURCE_OPTIONS}
    />
  )
}

const CORNER_RX: Record<string, number> = { rounded: 3.5, square: 1, circle: 7 }

const CORNER_ROW_OPTIONS: SelectRowOption[] = CORNER_OPTIONS.map((o) => ({
  ...o,
  illustration: <CornerGlyph rx={CORNER_RX[o.value] ?? 3.5} />,
}))

export function CheckboxSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <FillRow studio={studio} field="checkboxColor" />
      <SelectRow
        label="Corner"
        value={state.checkCorner}
        onChange={set("checkCorner")}
        options={CORNER_ROW_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
