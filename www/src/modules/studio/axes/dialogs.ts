/* Dialogs — how modal layers meet the page. Backdrop: a plain scrim
   (shadcn/Radix, Vaul), a lighter scrim that frosts the page behind (Apple
   sheets, Arc), or nothing but the panel's shadow (Linear). Position: the
   classic centered modal, or docked in the upper third (Linear, Raycast) so the
   top edge stays put as content grows.

   Modal motion: how the panel and its backdrop enter and leave. The sheet
   has none: it slides on the browser's native scroll, which sets its own
   timing.

   Engine: `backdrop` is an enum param on both `modal` and `sheet` (a synced
   group — one axis writes both); `position` and `motion` are `modal` params,
   the motion timed by its `--studio-modal-*` vars. */

import type { Resolved, StudioState } from "./index"
import { ease, resolveEntrance } from "./motion"
import type { Entrance } from "./motion"
import { entrance, oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

/* shadcn's (style-nova + tw-animate): the panel fades and zooms from 95%,
   the overlay fades, 100ms both ways on CSS `ease`. */
const MODAL_MOTION: Entrance = {
  pattern: "scale",
  enter: 100,
  curve: { type: "easing", ease: ease("ease") },
  exit: 100,
  exitEase: ease("ease"),
}

export const DIALOG_DEFAULTS = {
  dialogBackdrop: "dim",
  dialogPosition: "center",
  modalMotion: MODAL_MOTION,
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

export const MODAL_PATTERNS = [
  { value: "scale", label: "Scale" },
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "none", label: "None" },
]

export const DIALOG_SCHEMA: ChapterSchema<typeof DIALOG_DEFAULTS> = {
  dialogBackdrop: oneOf(BACKDROP_OPTIONS),
  dialogPosition: oneOf(POSITION_OPTIONS),
  modalMotion: entrance(MODAL_PATTERNS),
}

export function resolveDialogs(state: StudioState): Resolved {
  const backdrop = state.dialogBackdrop
  const modal = resolveEntrance("modal", state.modalMotion, MODAL_MOTION)
  return {
    tokens: modal.tokens,
    params: {
      modal: {
        backdrop,
        position: state.dialogPosition,
        motion: modal.pattern,
      },
      sheet: { backdrop },
    },
  }
}
