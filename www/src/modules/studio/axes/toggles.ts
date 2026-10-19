/* Toggles — a selected toggle's look, on Toggle Button and every Toggle
   Group segment. The face, hover and press come from Buttons. Tone steps the
   neutral down, Solid and Tint read the selection color, Inverse snaps to
   full contrast. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const SELECTED_VALUES = ["tone", "solid", "tint", "inverse"] as const

export const chapter = defineChapter({
  id: "toggles",
  defaults: {
    toggleSelected: "tone",
  },
  schema: {
    toggleSelected: oneOf(SELECTED_VALUES),
  },
  resolve(state: Effective): Resolved {
    return { params: { "toggle-button": { selected: state.toggleSelected } } }
  },
  rules: [
    {
      // Tone and Tint are lighter than a Solid rest fill: selection reads off.
      id: "toggles/solid-secondary-needs-strong-selected",
      target: "toggleSelected",
      when: { key: "buttonSecondary", in: ["solid"] },
      effect: {
        kind: "exclude",
        options: ["tone", "tint"],
        fallback: "inverse",
      },
      cause: "buttonSecondary",
    },
    {
      // Tone and Tint would read backwards: off is the brand's tint, on gray.
      id: "toggles/tonal-secondary-needs-solid-selected",
      target: "toggleSelected",
      when: { key: "buttonSecondary", in: ["tonal"] },
      effect: { kind: "exclude", options: ["tone", "tint"], fallback: "solid" },
      cause: "buttonSecondary",
    },
  ],
})
