/* Cursor — what the pointer becomes over each kind of control: enabled,
   pending, disabled, draggable. Engine: four `--cursor-*` tokens in base.css
   that every registry component reads through the cursor-* utilities. */

import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

/* Defaults mirror base.css. */
export const CURSOR_DEFAULTS = {
  cursorControls: "pointer",
  cursorPending: "default",
  cursorDragging: "inherit",
  cursorDisabled: "not-allowed",
}

/* Keyword values only: a cursor token is written straight into CSS. */
export const CURSOR_OPTIONS = {
  cursorControls: [
    { value: "default", label: "Arrow" },
    { value: "pointer", label: "Hand" },
  ],
  cursorPending: [
    { value: "default", label: "Arrow" },
    { value: "progress", label: "Progress" },
    { value: "wait", label: "Wait" },
  ],
  cursorDragging: [
    { value: "inherit", label: "Arrow" },
    { value: "grab", label: "Grab" },
  ],
  cursorDisabled: [
    { value: "default", label: "Arrow" },
    { value: "not-allowed", label: "Blocked" },
  ],
} satisfies Record<keyof typeof CURSOR_DEFAULTS, unknown>

export const CURSOR_SCHEMA: ChapterSchema<typeof CURSOR_DEFAULTS> = {
  cursorControls: oneOf(CURSOR_OPTIONS.cursorControls),
  cursorPending: oneOf(CURSOR_OPTIONS.cursorPending),
  cursorDragging: oneOf(CURSOR_OPTIONS.cursorDragging),
  cursorDisabled: oneOf(CURSOR_OPTIONS.cursorDisabled),
}

export function resolveCursor(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  if (state.cursorControls !== CURSOR_DEFAULTS.cursorControls)
    tokens["--cursor-interactive"] = state.cursorControls
  if (state.cursorPending !== CURSOR_DEFAULTS.cursorPending)
    tokens["--cursor-pending"] = state.cursorPending
  if (state.cursorDisabled !== CURSOR_DEFAULTS.cursorDisabled)
    tokens["--cursor-disabled"] = state.cursorDisabled
  if (state.cursorDragging === "grab") {
    tokens["--cursor-drag"] = "grab"
    tokens["--cursor-dragging"] = "grabbing"
  }
  return { tokens }
}
