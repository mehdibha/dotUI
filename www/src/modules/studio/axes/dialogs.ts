/* Dialogs — how modal layers meet the page. Backdrop: a plain scrim
   (shadcn/Radix, Vaul), a lighter scrim that frosts the page behind (Apple
   sheets, Arc), or nothing but the panel's shadow (Linear). Position: the
   classic centered modal, or docked in the upper third (Linear, Raycast) so the
   top edge stays put as content grows.

   Engine: `backdrop` is an enum param on both `modal` and `drawer` (a synced
   group — one axis writes both); `position` is a `modal` param. */

import type { Resolved, StudioState } from "./index"
import { pick } from "./pick"

export const DIALOG_DEFAULTS = {
  dialogBackdrop: "dim",
  dialogPosition: "center",
}

export const BACKDROP_OPTIONS = [
  { value: "dim", label: "Dim" },
  { value: "blur", label: "Blur" },
  { value: "none", label: "None" },
]

export const POSITION_OPTIONS = [
  { value: "center", label: "Center" },
  { value: "top", label: "Top" },
]

export function resolveDialogs(state: StudioState): Resolved {
  const backdrop = pick(BACKDROP_OPTIONS, state.dialogBackdrop, "dim")
  const position = pick(POSITION_OPTIONS, state.dialogPosition, "center")
  return {
    params: { modal: { backdrop, position }, drawer: { backdrop } },
  }
}
