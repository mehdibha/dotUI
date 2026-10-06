/* Pickers — the trigger caret the select wears: chevron-down (Material,
   Spectrum, Carbon, Radix Themes, Geist) vs chevrons-up-down (macOS pop-up
   buttons, shadcn combobox).

   Engine: `caret` is an enum param on `select`; its non-default value swaps
   the trigger icon in the shipped file (select/meta.ts `source`). The time
   picker's hover/selected fill and the swatch picker's selection ring ease on
   their own `--studio-<c>-state-*` vars. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { resolveStateChange, TAILWIND_TIMING } from "./motion"
import { oneOf, STATE_CHANGE } from "./schema"
import type { ChapterSchema } from "./schema"

/* shadcn has neither picker: today's look. The time column is a bare
   `transition-colors` (Tailwind's default); the swatch ring a 100ms one. */
const TIME_PICKER_MOTION = TAILWIND_TIMING
const COLOR_SWATCH_PICKER_MOTION = { ...TAILWIND_TIMING, duration: 100 }

export const PICKER_DEFAULTS = {
  pickerCaret: "chevron",
  timePickerMotion: TIME_PICKER_MOTION,
  colorSwatchPickerMotion: COLOR_SWATCH_PICKER_MOTION,
}

export const CARET_OPTIONS = [
  { value: "chevron", label: "Chevron" },
  { value: "double", label: "Up-down" },
]

export const PICKER_SCHEMA: ChapterSchema<typeof PICKER_DEFAULTS> = {
  pickerCaret: oneOf(CARET_OPTIONS),
  timePickerMotion: STATE_CHANGE,
  colorSwatchPickerMotion: STATE_CHANGE,
}

export function resolvePickers(state: Effective): Resolved {
  return {
    tokens: {
      ...resolveStateChange(
        "time-picker",
        state.timePickerMotion,
        TIME_PICKER_MOTION,
      ),
      ...resolveStateChange(
        "color-swatch-picker",
        state.colorSwatchPickerMotion,
        COLOR_SWATCH_PICKER_MOTION,
      ),
    },
    params: { select: { caret: state.pickerCaret } },
  }
}

export const chapter = defineChapter({
  id: "pickers",
  defaults: PICKER_DEFAULTS,
  schema: PICKER_SCHEMA,
  resolve: resolvePickers,
})
