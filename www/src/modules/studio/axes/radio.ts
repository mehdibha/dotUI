/* Radio — always a circle, so its only axis is Fill, a leaf of Color's
   Primary. See checkbox.ts for the mechanism. */

import { fillScope, PRIMARY_LEAF_LABELS, SOURCE_OPTIONS } from "./color"
import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const RADIO_DEFAULTS = {
  radioColor: "neutral",
}

const SEEN_IN: Record<string, string[]> = {
  neutral: ["shadcn/ui", "Carbon"],
  accent: ["Radix Themes", "Material 3", "Primer"],
}

export function resolveRadio(state: StudioState): Resolved {
  return { color: fillScope(state, "radio", state.radioColor) }
}

export const RADIO_SPEC = {
  label: "Radio",
  description:
    "The selected radio: a filled circle with a small contrasting dot.",
  axes: {
    radioColor: {
      label: PRIMARY_LEAF_LABELS.radioColor,
      description:
        "What fills a selected radio. A leaf of Color's Primary: when " +
        "Checkbox or Switch shares its value it paints with the selection " +
        "tokens; alone against both it forks to its own source.",
      value: {
        type: "enum",
        options: SOURCE_OPTIONS.map((option) => ({
          ...option,
          seenIn: SEEN_IN[option.value],
        })),
      },
      guidance:
        "Every system checked colors radio and checkbox alike: shadcn/ui " +
        "and Carbon neutral, Radix Themes, Material 3 and Primer accent. " +
        "Set it with Checkbox.",
    },
  },
} satisfies ChapterSpec<typeof RADIO_DEFAULTS>
