/* Dialogs — how modal layers meet the page. Backdrop: a plain scrim
   (shadcn/Radix, Vaul), a lighter scrim that frosts the page behind (Apple
   sheets, Arc), or nothing but the panel's shadow (Linear). Position: the
   classic centered modal, or docked in the upper third (Linear, Raycast) so the
   top edge stays put as content grows.

   Engine: `backdrop` is an enum param on both `modal` and `drawer` (a synced
   group — one axis writes both); `position` is a `modal` param. */

import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { Schema } from "./schema"

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

export const DIALOG_SCHEMA: Schema<typeof DIALOG_DEFAULTS> = {
  dialogBackdrop: oneOf(BACKDROP_OPTIONS),
  dialogPosition: oneOf(POSITION_OPTIONS),
}

export function resolveDialogs(state: StudioState): Resolved {
  const backdrop = state.dialogBackdrop
  const position = state.dialogPosition
  return {
    params: { modal: { backdrop, position }, drawer: { backdrop } },
  }
}
