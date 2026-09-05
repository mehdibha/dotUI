import type { Resolved, StudioState } from "./index"

export const SCROLLBAR_DEFAULTS = {
  scrollbarStyle: "native",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveScrollbars(_state: StudioState): Resolved {
  return {}
}
