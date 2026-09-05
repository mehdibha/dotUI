import type { Resolved, StudioState } from "./index"

export const BUTTON_DEFAULTS = {
  buttonStyle: "flat",
  buttonRadius: "auto",
  buttonHover: "dim",
  buttonPress: "dim",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveButtons(_state: StudioState): Resolved {
  return {}
}
