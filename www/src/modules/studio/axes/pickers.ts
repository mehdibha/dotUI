/* Pickers — the trigger caret the select wears: chevron-down or
   chevrons-up-down.

   Engine: `caret` is an enum param on `select`; its non-default value swaps
   the trigger icon in the shipped file (select/meta.ts `source`). */

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
  return { params: { select: { caret } } }
}

export const PICKER_SPEC = {
  label: "Pickers",
  description:
    "The select trigger's caret. The trigger shell comes from Inputs, the " +
    "open list from Menus.",
  axes: {
    pickerCaret: {
      label: "Caret",
      description:
        "The icon at the end of a Select trigger. Combobox triggers are " +
        "composed per use and keep their own icon.",
      value: { type: "enum", options: CARET_OPTIONS },
      guidance:
        "5 of 8 checked systems use the down chevron. Up-down says the list " +
        "opens around the current value rather than below it — Mantine, " +
        "Base UI and coss ui use it, and it suits a desktop-app feel.",
    },
  },
} satisfies ChapterSpec<typeof PICKER_DEFAULTS>
