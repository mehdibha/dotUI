/* Cursor — what the pointer becomes over each kind of control: enabled,
   pending, disabled, draggable. Engine: four `--cursor-*` tokens in base.css
   that every registry component reads through the cursor-* utilities. */

import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { Schema } from "./schema"

/* Defaults mirror base.css. */
export const CURSOR_DEFAULTS = {
  cursorControls: "pointer",
  cursorPending: "default",
  cursorDragging: "inherit",
  cursorDisabled: "not-allowed",
}

export const CONTROLS_OPTIONS = [
  { value: "default", label: "Arrow" },
  { value: "pointer", label: "Hand" },
]

export const PENDING_OPTIONS = [
  { value: "default", label: "Arrow" },
  { value: "progress", label: "Progress" },
  { value: "wait", label: "Wait" },
]

export const DRAGGING_OPTIONS = [
  { value: "inherit", label: "Arrow" },
  { value: "grab", label: "Grab" },
]

export const DISABLED_OPTIONS = [
  { value: "default", label: "Arrow" },
  { value: "not-allowed", label: "Blocked" },
]

export const CURSOR_SCHEMA: Schema<typeof CURSOR_DEFAULTS> = {
  cursorControls: oneOf(CONTROLS_OPTIONS),
  cursorPending: oneOf(PENDING_OPTIONS),
  cursorDragging: oneOf(DRAGGING_OPTIONS),
  cursorDisabled: oneOf(DISABLED_OPTIONS),
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
