/* Spinner — the indeterminate loading signature: ring (Material/Carbon/
   shadcn) vs blades (Apple/Geist/Radix Themes) vs dots (HeroUI, chat UIs).

   Engine: `style` is a files-based enum param on `loader` — each value ships
   its own base file. Ring is the icon library's own loader glyph, so it
   follows the Icons chapter. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const SPINNER_DEFAULTS = {
  spinnerStyle: "ring",
}

export const STYLE_OPTIONS = [
  {
    value: "ring",
    label: "Ring",
    description:
      "The icon library's loader glyph spinning — usually an open arc.",
    seenIn: ["shadcn/ui", "Primer", "Fluent 2", "Mantine", "HeroUI"],
  },
  {
    value: "blades",
    label: "Blades",
    description:
      "Eight radial blades with a fading opacity ramp, stepping round " +
      "once every 0.8s.",
    seenIn: ["Radix Themes"],
  },
  {
    value: "dots",
    label: "Dots",
    description:
      "Three dots in a row, each fading 25%–100% with a 150ms stagger.",
    seenIn: ["Mantine", "HeroUI"],
  },
]

export function resolveSpinner(state: StudioState): Resolved {
  const style = STYLE_OPTIONS.some((o) => o.value === state.spinnerStyle)
    ? state.spinnerStyle
    : SPINNER_DEFAULTS.spinnerStyle
  return { params: { loader: { style } } }
}

export const SPINNER_SPEC = {
  label: "Spinner",
  description:
    "The indeterminate loading glyph used in buttons, fields and empty " +
    "states. Each style ships as its own loader file.",
  axes: {
    spinnerStyle: {
      label: "Spinner",
      description: "The spinner's form and motion.",
      value: { type: "enum", options: STYLE_OPTIONS },
      guidance:
        "shadcn, Primer, Fluent 2 and HeroUI default to a ring (Mantine " +
        "ships it as `oval`); Radix Themes draws blades; Mantine and HeroUI " +
        "also ship dots. Ring matches the icon library's stroke; blades " +
        "feel native next to macOS/iOS; dots suit chat and typing states.",
    },
  },
} satisfies ChapterSpec<typeof SPINNER_DEFAULTS>
