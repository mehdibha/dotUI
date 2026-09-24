/* Dialogs — how modal layers meet the page. Backdrop: a plain scrim
   (shadcn/Radix, Vaul), a lighter scrim that frosts the page behind (Apple
   sheets, Arc), or nothing but the panel's shadow (Linear). Position: the
   classic centered modal, or docked in the upper third (Linear, Raycast) so the
   top edge stays put as content grows. Sheet: a bottom drawer docked edge to
   edge (Vaul/shadcn, Material), or floating inside the screen edges until it
   expands (iOS 26).

   Engine: `backdrop` is an enum param on both `modal` and `drawer` (a synced
   group — one axis writes both); `position` is a `modal` param; `sheet` a
   `drawer` param. */

import type { Resolved, StudioState } from "./index"
import { pick } from "./pick"

export const DIALOG_DEFAULTS = {
  dialogBackdrop: "dim",
  dialogPosition: "center",
  dialogSheet: "attached",
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

export const SHEET_OPTIONS = [
  { value: "attached", label: "Attached" },
  { value: "floating", label: "Floating" },
]

export function resolveDialogs(state: StudioState): Resolved {
  const backdrop = pick(BACKDROP_OPTIONS, state.dialogBackdrop, "dim")
  const position = pick(POSITION_OPTIONS, state.dialogPosition, "center")
  const sheet = pick(SHEET_OPTIONS, state.dialogSheet, "attached")
  return {
    params: { modal: { backdrop, position }, drawer: { backdrop, sheet } },
  }
}
