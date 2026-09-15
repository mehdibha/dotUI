"use client"

/* Pickers — the trigger caret shared by select and combobox: chevron-down
   (Material, Spectrum, Carbon, Radix Themes, Geist) vs chevrons-up-down
   (macOS pop-up buttons, shadcn combobox); triangle carets are dead and
   "none" unattested, so two options only. Rejected: trigger shell (Inputs
   owns the field shell), clear affordance (Ant allowClear / MUI clearable =
   prop), date trigger field-vs-button (the date picker ships a shell; its
   trigger is the consumer's composition, and a button trigger would need a
   value-display API the registry doesn't have). The listbox belongs to
   Menus. */

import { CARET_OPTIONS } from "../axes/pickers"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio } from "../state"

/* ------------------------------ Option glyphs ------------------------------ */

function CaretGlyph({ caret }: { caret: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {caret === "chevron" ? (
        <path d="m6 9 6 6 6-6" />
      ) : (
        <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
      )}
    </svg>
  )
}

const OPTIONS: SelectRowOption[] = CARET_OPTIONS.map((o) => ({
  ...o,
  illustration: <CaretGlyph caret={o.value} />,
}))

export function PickersSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Caret"
        value={state.pickerCaret}
        onChange={set("pickerCaret")}
        options={OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
