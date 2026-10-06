/* Message scroller — the jump-to-latest button: it slides in from the edge
   while scaling up from 95% and fading, and leaves the same way, on the
   `--studio-message-scroller-*` vars (in when active, out when not). */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { resolveEntrance } from "./motion"
import type { Entrance } from "./motion"
import { entrance } from "./schema"
import type { ChapterSchema } from "./schema"

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

export const MESSAGE_SCROLLER_SCHEMA: ChapterSchema<
  typeof MESSAGE_SCROLLER_DEFAULTS
> = {
  messageScrollerMotion: entrance(MOTION_PATTERNS),
}

export function resolveMessageScroller(state: Effective): Resolved {
  return {
    tokens: resolveEntrance(
      "message-scroller",
      state.messageScrollerMotion,
      MOTION,
    ).tokens,
  }
}

export const chapter = defineChapter({
  id: "message-scroller",
  defaults: MESSAGE_SCROLLER_DEFAULTS,
  schema: MESSAGE_SCROLLER_SCHEMA,
  resolve: resolveMessageScroller,
})
