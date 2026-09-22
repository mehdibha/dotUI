/* Number field — where the steppers sit: an attached pair on the right, one
   at each end, or a stacked chevron column.

   Engine: `number-field.steppers` swaps the shipped base file — the layouts
   differ in structure, not classes. */

import type { Resolved, StudioState } from "./index"
import { pick } from "./inputs"
import type { ChapterSpec } from "./spec"

export const NUMBER_FIELD_DEFAULTS = {
  numberLayout: "right",
}

export const NUMBER_LAYOUT_OPTIONS = [
  {
    value: "right",
    label: "Right",
    description:
      "Minus and plus buttons attached side by side to the input's " +
      "trailing edge, sharing its border as one segmented group.",
    seenIn: ["Spectrum 2", "Carbon"],
  },
  {
    value: "split",
    label: "Split",
    description:
      "A minus button attached to the input's leading edge and a plus " +
      "button to its trailing edge, with the value centered between them.",
    seenIn: ["HeroUI", "coss ui", "Base UI", "Ant Design"],
  },
  {
    value: "stacked",
    label: "Stacked",
    description:
      "A narrow column of up and down chevrons, one above the other, at " +
      "the trailing end.",
    seenIn: ["Mantine", "Chakra UI", "Fluent 2", "Ant Design", "React Aria"],
  },
]

export function resolveNumberField(state: StudioState): Resolved {
  return {
    params: {
      "number-field": {
        steppers: pick(NUMBER_LAYOUT_OPTIONS, state.numberLayout, "right"),
      },
    },
  }
}

export const NUMBER_FIELD_SPEC = {
  label: "Number field",
  description:
    "The number field's stepper buttons. The shell comes from Inputs.",
  axes: {
    numberLayout: {
      label: "Number field",
      description:
        "Where the increment and decrement buttons sit and what they show: " +
        "minus/plus pairs or up/down chevrons.",
      value: { type: "enum", options: NUMBER_LAYOUT_OPTIONS },
      guidance:
        "Stacked chevrons are the most common default (5 of 10 checked: " +
        "Mantine, Chakra, Fluent 2, Ant Design, React Aria's starter) and " +
        "read as desktop. Split gives touch-sized targets (HeroUI, coss ui, " +
        "Base UI, Ant's spinner mode); Right keeps the value left-aligned " +
        "with large targets (Spectrum 2, Carbon).",
    },
  },
} satisfies ChapterSpec<typeof NUMBER_FIELD_DEFAULTS>
