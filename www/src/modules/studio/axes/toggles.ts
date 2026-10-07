/* Toggles — a selected toggle's look, on Toggle Button and every Toggle
   Group segment. The face, hover and press come from Buttons. Tone steps the
   neutral down, Solid and Tint read the selection color, Inverse snaps to
   full contrast.

   Engine: `selected` enum param on `toggle-button`. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const TOGGLE_DEFAULTS = {
  toggleSelected: "tone",
}

export const SELECTED_VALUES = ["tone", "solid", "tint", "inverse"] as const

export const TOGGLE_SCHEMA: ChapterSchema<typeof TOGGLE_DEFAULTS> = {
  toggleSelected: oneOf(SELECTED_VALUES),
}

export function resolveToggles(state: Effective): Resolved {
  return { params: { "toggle-button": { selected: state.toggleSelected } } }
}

export const chapter = defineChapter({
  id: "toggles",
  defaults: TOGGLE_DEFAULTS,
  schema: TOGGLE_SCHEMA,
  resolve: resolveToggles,
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
  ],
})
