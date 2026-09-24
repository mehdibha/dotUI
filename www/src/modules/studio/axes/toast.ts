/* Toast — the floating notice. Motion: how a toast enters, restacks and
   leaves, and how fast one swiped away finishes the throw.

   Engine: `motion` is an enum param on `toast`, timed by its
   `--studio-toast-*` vars; the swipe is its own `--studio-toast-swipe-*`
   state change. */

import type { Resolved, StudioState } from "./index"
import { ease, resolveEntrance, resolveStateChange } from "./motion"
import type { Entrance, StateChange } from "./motion"

/* Sonner's, shadcn's toast: 400ms both ways on CSS `ease`; a swipe-out
   finishes in 200ms on ease-out. */
const MOTION: Entrance = {
  pattern: "slide",
  enter: 400,
  curve: { type: "easing", ease: ease("ease") },
  exit: 400,
  exitEase: ease("ease"),
}
const SWIPE: StateChange = { duration: 200, ease: ease("ease-out") }

export const TOAST_DEFAULTS = {
  toastMotion: MOTION,
  toastSwipeMotion: SWIPE,
}

export const MOTION_PATTERNS = [
  { value: "slide", label: "Slide" },
  { value: "fade", label: "Fade" },
  { value: "none", label: "None" },
]

export function resolveToast(state: StudioState): Resolved {
  const motion = resolveEntrance(
    "toast",
    state.toastMotion,
    MOTION,
    MOTION_PATTERNS,
  )
  return {
    tokens: {
      ...motion.tokens,
      ...resolveStateChange("toast-swipe", state.toastSwipeMotion, SWIPE),
    },
    params: { toast: { motion: motion.pattern } },
  }
}
