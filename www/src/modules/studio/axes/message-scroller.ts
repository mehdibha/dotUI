/* Message scroller — the jump-to-latest button: it slides in from the edge
   while scaling up from 95% and fading, and leaves the same way, on the
   `--studio-message-scroller-*` vars (in when active, out when not). */

import type { Resolved, StudioState } from "./index"
import { resolveEntrance } from "./motion"
import type { Entrance } from "./motion"

/* shadcn has no message scroller: today's look, a quick strong ease-out in
   and a slower ease-in out. */
const MOTION: Entrance = {
  pattern: "slide",
  enter: 200,
  curve: { type: "easing", ease: [0.23, 1, 0.32, 1] },
  exit: 400,
  exitEase: [0.7, 0, 0.84, 0],
}

/** The button always slides; there's no pattern to pick. */
export const MOTION_PATTERNS = [{ value: "slide", label: "Slide" }]

export const MESSAGE_SCROLLER_DEFAULTS = {
  messageScrollerMotion: MOTION,
}

export function resolveMessageScroller(state: StudioState): Resolved {
  return {
    tokens: resolveEntrance(
      "message-scroller",
      state.messageScrollerMotion,
      MOTION,
      MOTION_PATTERNS,
    ).tokens,
  }
}
