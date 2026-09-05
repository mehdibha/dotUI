import type { Resolved, StudioState } from "./index"

export const CHECKBOX_DEFAULTS = {
  checkFill: "accent",
  checkCorner: "rounded",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveCheckbox(_state: StudioState): Resolved {
  return {}
}
