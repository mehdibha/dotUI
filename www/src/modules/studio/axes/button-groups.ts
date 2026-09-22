/* Button groups — the separator between attached segments, shared by Button
   Group and Toggle Group (a synced pair: one axis writes both).

   Engine: `separator` enum param on `group` and `toggle-button-group`. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const BUTTON_GROUP_DEFAULTS = {
  groupSeparator: "auto",
}

export const SEPARATOR_OPTIONS = [
  {
    value: "auto",
    label: "Auto",
    description:
      "The segments' own edges divide them: bordered buttons overlap into " +
      "one shared hairline, filled buttons abut with no line.",
    seenIn: ["shadcn/ui", "Primer"],
  },
  {
    value: "divider",
    label: "Divider",
    description:
      "Borders between segments drop and a 1px line at 20% of the text " +
      "color is drawn, inset 6px from the top and bottom; in a toggle group " +
      "it hides beside the selected segment.",
    seenIn: ["shadcn/ui"],
  },
  {
    value: "none",
    label: "None",
    description:
      "Borders between segments drop with nothing in their place, so the " +
      "group reads as one continuous shape.",
  },
]

export function resolveButtonGroups(state: StudioState): Resolved {
  const separator = SEPARATOR_OPTIONS.some(
    (o) => o.value === state.groupSeparator,
  )
    ? state.groupSeparator
    : "auto"
  return {
    params: {
      group: { separator },
      "toggle-button-group": { separator },
    },
  }
}

export const BUTTON_GROUP_SPEC = {
  label: "Button groups",
  description:
    "How attached buttons in a Button Group or Toggle Group are divided " +
    "from each other.",
  axes: {
    groupSeparator: {
      label: "Groups",
      description:
        "What separates two adjacent buttons. Seams beside a text, input or " +
        "select child keep the Auto treatment.",
      value: { type: "enum", options: SEPARATOR_OPTIONS },
      guidance:
        "Shared borders are the norm: shadcn/ui drops each inner left border " +
        "and Primer overlaps them by 1px. shadcn/ui adds an explicit " +
        "ButtonGroupSeparator (full height) for filled buttons whose edges " +
        "would otherwise merge. Pick Divider when groups mostly hold filled " +
        "or quiet buttons.",
    },
  },
} satisfies ChapterSpec<typeof BUTTON_GROUP_DEFAULTS>
