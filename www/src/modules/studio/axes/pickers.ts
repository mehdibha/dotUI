/* Pickers — the trigger caret Select and Combobox wear: chevron-down or
   chevrons-up-down.

   Engine: `caret` is an enum param on `select` and `combobox`; its
   non-default value swaps the trigger icon in each shipped file (meta.ts
   `source`). */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const PICKER_DEFAULTS = {
  pickerCaret: "chevron",
}

export const CARET_OPTIONS = [
  {
    value: "chevron",
    label: "Chevron",
    description: "A single down-pointing chevron at the trigger's end.",
    seenIn: ["shadcn/ui", "Radix Themes", "HeroUI", "Spectrum 2", "React Aria"],
  },
  {
    value: "double",
    label: "Up-down",
    description:
      "A pair of chevrons pointing up and down, stacked — the macOS " +
      "pop-up button glyph.",
    seenIn: ["Mantine", "Base UI", "coss ui"],
  },
]

export function resolvePickers(state: StudioState): Resolved {
  const caret = CARET_OPTIONS.some((o) => o.value === state.pickerCaret)
    ? state.pickerCaret
    : "chevron"
  return { params: { select: { caret }, combobox: { caret } } }
}

export const PICKER_SPEC = {
  label: "Pickers",
  description:
    "The caret on Select and Combobox triggers. The trigger shell comes " +
    "from Inputs, the open list from Menus.",
  axes: {
    pickerCaret: {
      label: "Caret",
      description:
        "The icon at the end of a Select trigger and on a Combobox's " +
        "open button — both always wear the same one.",
      value: { type: "enum", options: CARET_OPTIONS },
      guidance:
        "5 of 8 checked systems use the down chevron. Up-down says the list " +
        "opens around the current value rather than below it — Mantine, " +
        "Base UI and coss ui use it, and it suits a desktop-app feel.",
    },
  },
} satisfies ChapterSpec<typeof PICKER_DEFAULTS>
