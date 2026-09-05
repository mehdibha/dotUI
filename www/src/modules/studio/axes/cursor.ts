import type { Resolved, StudioState } from "./index"

export const CURSOR_DEFAULTS = {
  cursorControls: "default",
  cursorPending: "default",
  cursorDragging: "inherit",
  cursorDisabled: "not-allowed",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveCursor(_state: StudioState): Resolved {
  return {}
}
