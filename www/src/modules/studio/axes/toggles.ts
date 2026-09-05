/* Toggles — Toggle Button ⇄ Toggle Group, synced on one selected look: fill
   (tone-on-tone, dotUI today), chip (page-colored chip lifted on shadow),
   inverse (snaps to full contrast). The family look, hover and press come
   from the Buttons axis; the attached shell from Button groups.

   Engine: `selected` enum param on `toggle-button`. */

import type { Resolved, StudioState } from "./index"

export const TOGGLE_DEFAULTS = {
  toggleSelected: "fill",
}

export const SELECTED_OPTIONS = [
  { value: "fill", label: "Fill" },
  { value: "chip", label: "Chip" },
  { value: "inverse", label: "Inverse" },
]

export const WIRED = true

export function resolveToggles(state: StudioState): Resolved {
  const selected = SELECTED_OPTIONS.some(
    (o) => o.value === state.toggleSelected,
  )
    ? state.toggleSelected
    : "fill"
  return { params: { "toggle-button": { selected } } }
}
