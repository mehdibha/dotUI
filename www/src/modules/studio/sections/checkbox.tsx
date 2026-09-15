"use client"

/* Checkbox — lead of the selection-control family (Checkbox ⇄ Radio ⇄ Switch),
   split into one chapter per control but synced on one look, the Button ⇄
   ToggleButton model. Fill is the family axis and lives here; Radio, Switch
   and Choice cards re-surface the same key. Neutral wears bg-fg with a
   bg-colored mark — the near-black fill that inverts per mode — rather than
   any fixed dark token. A radio is always a circle and a switch is always a
   pill, so Corner stops at the box. */

import { CORNER_OPTIONS, FILL_OPTIONS } from "../axes/checkbox"
import { ControlGroup, SegmentedControlRow, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

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

/** The family's synced axis, shown in each chapter — one key, one look. */
export function FillRow({ studio }: { studio: Studio }) {
  return (
    <SegmentedControlRow
      label="Fill"
      value={studio.state.checkFill}
      onChange={studio.set("checkFill")}
      options={FILL_OPTIONS}
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
      <FillRow studio={studio} />
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
