import type { Resolved, StudioState } from "./index"

export const RADIO_DEFAULTS = {
  checkFill: "accent",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveRadio(_state: StudioState): Resolved {
  return {}
}
