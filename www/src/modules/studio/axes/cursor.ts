/* Cursor — what the pointer becomes over each kind of control: enabled,
   pending, disabled, draggable. Engine: four `--cursor-*` tokens in base.css
   that every registry component reads through the cursor-* utilities. */

import type { Resolved, StudioState } from "./index"

/* Defaults mirror base.css. */
export const CURSOR_DEFAULTS = {
  cursorControls: "pointer",
  cursorPending: "default",
  cursorDragging: "inherit",
  cursorDisabled: "not-allowed",
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
