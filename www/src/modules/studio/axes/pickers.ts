/* Pickers — the trigger caret the select wears: chevron-down (Material,
   Spectrum, Carbon, Radix Themes, Geist) vs chevrons-up-down (macOS pop-up
   buttons, shadcn combobox).

   Engine: `caret` is an enum param on `select`; its non-default value swaps
   the trigger icon in the shipped file (select/meta.ts `source`). */

import type { Resolved, StudioState } from "./index"

export const PICKER_DEFAULTS = {
  pickerCaret: "chevron",
}

export const CARET_OPTIONS = [
  { value: "chevron", label: "Chevron" },
  { value: "double", label: "Up-down" },
]

export const WIRED = true

export function resolvePickers(state: StudioState): Resolved {
  const caret = CARET_OPTIONS.some((o) => o.value === state.pickerCaret)
    ? state.pickerCaret
    : "chevron"
  return { params: { select: { caret } } }
}
