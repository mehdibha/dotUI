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

export const SELECTED_OPTIONS = [
  { value: "tone", label: "Tone", description: "shadcn, Polaris, Untitled UI" },
  { value: "solid", label: "Solid", description: "Material 3, Spectrum 2" },
  { value: "tint", label: "Tint", description: "Atlassian, Ant, Duolingo" },
  { value: "inverse", label: "Inverse", description: "Spectrum 2, Spotify" },
]

export const TOGGLE_SCHEMA: ChapterSchema<typeof TOGGLE_DEFAULTS> = {
  toggleSelected: oneOf(SELECTED_OPTIONS),
}

export function resolveToggles(state: Effective): Resolved {
  return { params: { "toggle-button": { selected: state.toggleSelected } } }
}

export const chapter = defineChapter({
  id: "toggles",
  defaults: TOGGLE_DEFAULTS,
  schema: TOGGLE_SCHEMA,
  resolve: resolveToggles,
})
