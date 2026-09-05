import type { Resolved, StudioState } from "./index"

export const SELECTION_DEFAULTS = {
  selectionUiText: "selectable",
  selectionHighlight: "browser",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveSelection(_state: StudioState): Resolved {
  return {}
}
