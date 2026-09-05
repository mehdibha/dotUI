import type { Resolved, StudioState } from "./index"

export const SWITCH_DEFAULTS = {
  checkFill: "accent",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveSwitch(_state: StudioState): Resolved {
  return {}
}
