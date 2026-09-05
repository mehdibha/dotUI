import type { Resolved, StudioState } from "./index"

export const BUTTON_GROUP_DEFAULTS = {
  groupSeparator: "auto",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveButtonGroups(_state: StudioState): Resolved {
  return {}
}
