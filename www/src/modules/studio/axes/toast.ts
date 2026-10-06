/* Toast — the floating notice. Motion: how a toast enters, restacks and
   leaves, and how fast one swiped away finishes the throw.

   Engine: `motion` is an enum param on `toast`, timed by its
   `--studio-toast-*` vars; the swipe is its own `--studio-toast-swipe-*`
   state change. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { ease, resolveEntrance, resolveStateChange } from "./motion"
import type { Entrance, StateChange } from "./motion"
import { entrance, STATE_CHANGE } from "./schema"
import type { ChapterSchema } from "./schema"

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

export const TOAST_SCHEMA: ChapterSchema<typeof TOAST_DEFAULTS> = {
  toastMotion: entrance(MOTION_PATTERNS),
  toastSwipeMotion: STATE_CHANGE,
}

export function resolveToast(state: Effective): Resolved {
  const motion = resolveEntrance("toast", state.toastMotion, MOTION)
  return {
    tokens: {
      ...motion.tokens,
      ...resolveStateChange("toast-swipe", state.toastSwipeMotion, SWIPE),
    },
    params: { toast: { motion: motion.pattern } },
  }
}

export const chapter = defineChapter({
  id: "toast",
  defaults: TOAST_DEFAULTS,
  schema: TOAST_SCHEMA,
  resolve: resolveToast,
})
