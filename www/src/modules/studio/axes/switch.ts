/* Switch — always a pill, so its only axis is Fill, a leaf of Color's
   Primary (Geist's blue toggle beside near-black checkboxes). See checkbox.ts
   for the mechanism. */

import { fillScope, PRIMARY_LEAF_LABELS, SOURCE_OPTIONS } from "./color"
import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const SWITCH_DEFAULTS = {
  switchColor: "neutral",
}

const SEEN_IN: Record<string, string[]> = {
  neutral: ["shadcn/ui", "Spectrum 2"],
  accent: ["Radix Themes", "Material 3", "Primer", "Geist"],
}

export function resolveSwitch(state: StudioState): Resolved {
  return { color: fillScope(state, "switch", state.switchColor) }
}

export const SWITCH_SPEC = {
  label: "Switch",
  description: "The on/off toggle — a pill track with a sliding thumb.",
  axes: {
    switchColor: {
      label: PRIMARY_LEAF_LABELS.switchColor,
      description:
        "What fills the track when the switch is on. A leaf of Color's " +
        "Primary: on the Selection leaf's value it paints with the selection " +
        "tokens, off it it forks to its own source.",
      value: {
        type: "enum",
        options: SOURCE_OPTIONS.map((option) => ({
          ...option,
          seenIn: SEEN_IN[option.value],
        })),
      },
      guidance:
        "Of 6 checked, shadcn/ui and Spectrum 2 (default; its emphasized " +
        "switch is accent) fill it neutral; Radix Themes, Material 3, " +
        "Primer and Geist use the accent. The switch is the one selection " +
        "control systems fork: Geist runs a blue switch beside near-black " +
        "checkboxes. Apple, Carbon and Atlassian fill it green: set Color's " +
        "Selection seed to that green and keep Switch on the Selection " +
        "leaf's value. Move Checkbox and Radio off that value if they " +
        "should stay neutral or brand, as Carbon does.",
    },
  },
} satisfies ChapterSpec<typeof SWITCH_DEFAULTS>
