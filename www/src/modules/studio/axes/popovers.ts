import type { Resolved, StudioState } from "./index"

export const POPOVER_DEFAULTS = {
  popoverTip: "none",
  popoverHeader: "title",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolvePopovers(_state: StudioState): Resolved {
  return {}
}
