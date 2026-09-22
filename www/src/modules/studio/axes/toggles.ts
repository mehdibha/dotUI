/* Toggles — Toggle Button ⇄ Toggle Group, synced on one selected look. The
   family look, hover and press come from the Buttons axis; the attached
   shell from Button groups.

   Engine: `selected` enum param on `toggle-button`. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const TOGGLE_DEFAULTS = {
  toggleSelected: "fill",
}

export const SELECTED_OPTIONS = [
  {
    value: "fill",
    label: "Fill",
    description:
      "A tone-on-tone gray fill (the neutral's selected step) with " +
      "full-contrast text.",
    seenIn: ["shadcn/ui", "coss ui"],
  },
  {
    value: "chip",
    label: "Chip",
    description:
      "A page-colored chip lifted on a small shadow; primary and quiet " +
      "toggles add a 1px hairline ring so it holds on dark wells.",
  },
  {
    value: "inverse",
    label: "Inverse",
    description:
      "Snaps to full contrast: the inverse fill (near-black in light mode, " +
      "near-white in dark) with page-colored text. A primary toggle, " +
      "already filled, flips to a page chip inside an inverse hairline.",
    seenIn: ["Spectrum 2", "Material 3"],
  },
]

export function resolveToggles(state: StudioState): Resolved {
  const selected = SELECTED_OPTIONS.some(
    (o) => o.value === state.toggleSelected,
  )
    ? state.toggleSelected
    : "fill"
  return { params: { "toggle-button": { selected } } }
}

export const TOGGLE_SPEC = {
  label: "Toggles",
  description:
    "How a Toggle Button, alone or in a Toggle Group, shows that it is on.",
  axes: {
    toggleSelected: {
      label: "Toggles",
      description: "The selected state's fill and text color.",
      value: { type: "enum", options: SELECTED_OPTIONS },
      guidance:
        "Of 4 checked, shadcn/ui and coss ui mark an on toggle with a soft " +
        "gray fill; Spectrum 2 (selected action button, gray-800) and " +
        "Material 3 (outlined toggle, inverse surface) flip to full " +
        "contrast. Fill suits dense toolbars with many toggles; Inverse " +
        "makes a single on state unmissable.",
    },
  },
} satisfies ChapterSpec<typeof TOGGLE_DEFAULTS>
