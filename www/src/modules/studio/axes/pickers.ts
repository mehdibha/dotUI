/* Pickers — the trigger caret the select wears: chevron-down (Material,
   Spectrum, Carbon, Radix Themes, Geist) vs chevrons-up-down (macOS pop-up
   buttons, shadcn combobox).

   Engine: `caret` is an enum param on `select`; its non-default value swaps
   the trigger icon in the shipped file (select/meta.ts `source`). */

import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const PICKER_DEFAULTS = {
  pickerCaret: "chevron",
}

export const CARET_OPTIONS = [
  { value: "chevron", label: "Chevron" },
  { value: "double", label: "Up-down" },
]

export const PICKER_SCHEMA: ChapterSchema<typeof PICKER_DEFAULTS> = {
  pickerCaret: oneOf(CARET_OPTIONS),
}

export function resolvePickers(state: StudioState): Resolved {
  return { params: { select: { caret: state.pickerCaret } } }
}
