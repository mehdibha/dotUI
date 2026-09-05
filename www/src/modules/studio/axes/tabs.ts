import type { Resolved, StudioState } from "./index"

export const TAB_DEFAULTS = {
  tabStyle: "line",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveTabs(_state: StudioState): Resolved {
  return {}
}
