/* Dialogs — how modal layers meet the page. Backdrop: a plain scrim
   (shadcn/Radix, Vaul), a lighter scrim that frosts the page behind (Apple
   sheets, Arc), or nothing but the panel's shadow (Linear). Position: the
   classic centered modal, or docked in the upper third (Linear, Raycast) so the
   top edge stays put as content grows.

   Modal motion: how the panel and its backdrop enter and leave. Drawer
   motion: how the sheet slides in and out.

   Engine: `backdrop` is an enum param on both `modal` and `drawer` (a synced
   group — one axis writes both); `position` and `motion` are `modal` params,
   the motion timed by its `--studio-modal-*` vars; drawer motion is its
   `--studio-drawer-*` timing vars (the slide itself is the drawer). */

import type { Resolved, StudioState } from "./index"
import { ease, resolveEntrance } from "./motion"
import type { Bezier, Entrance } from "./motion"
import { pick } from "./pick"

/* shadcn's (style-nova + tw-animate): the panel fades and zooms from 95%,
   the overlay fades, 100ms both ways on CSS `ease`. */
const MODAL_MOTION: Entrance = {
  pattern: "scale",
  enter: 100,
  curve: { type: "easing", ease: ease("ease") },
  exit: 100,
  exitEase: ease("ease"),
}

/* shadcn's Base UI drawer: 450ms in, 400ms out (scaled by the fling's
   strength), both on an ease-out-quint. */
const DRAWER_EASE: Bezier = [0.22, 1, 0.36, 1]
const DRAWER_MOTION: Entrance = {
  pattern: "slide",
  enter: 450,
  curve: { type: "easing", ease: DRAWER_EASE },
  exit: 400,
  exitEase: DRAWER_EASE,
}

export const DIALOG_DEFAULTS = {
  dialogBackdrop: "dim",
  dialogPosition: "center",
  modalMotion: MODAL_MOTION,
  drawerMotion: DRAWER_MOTION,
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

/** The drawer always slides; there's no pattern to pick. */
export const DRAWER_PATTERNS = [{ value: "slide", label: "Slide" }]

export function resolveDialogs(state: StudioState): Resolved {
  const backdrop = pick(BACKDROP_OPTIONS, state.dialogBackdrop, "dim")
  const position = pick(POSITION_OPTIONS, state.dialogPosition, "center")
  const modal = resolveEntrance(
    "modal",
    state.modalMotion,
    MODAL_MOTION,
    MODAL_PATTERNS,
  )
  return {
    tokens: {
      ...modal.tokens,
      ...resolveEntrance(
        "drawer",
        state.drawerMotion,
        DRAWER_MOTION,
        DRAWER_PATTERNS,
      ).tokens,
    },
    params: {
      modal: { backdrop, position, motion: modal.pattern },
      drawer: { backdrop },
    },
  }
}
