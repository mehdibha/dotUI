/* Pickers — the trigger caret the select wears: chevron-down (Material,
   Spectrum, Carbon, Radix Themes, Geist) vs chevrons-up-down (macOS pop-up
   buttons, shadcn combobox).

   Engine: `caret` is an enum param on `select`; its non-default value swaps
   the trigger icon in the shipped file (select/meta.ts `source`). The time
   picker's hover/selected fill and the swatch picker's selection ring ease on
   their own `--studio-<c>-state-*` vars. */

import type { Resolved, StudioState } from "./index"
import { resolveStateChange, TAILWIND_TIMING } from "./motion"

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

export function resolvePickers(state: StudioState): Resolved {
  const caret = CARET_OPTIONS.some((o) => o.value === state.pickerCaret)
    ? state.pickerCaret
    : "chevron"
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
    params: { select: { caret } },
  }
}
