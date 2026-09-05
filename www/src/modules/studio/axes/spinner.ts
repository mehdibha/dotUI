import type { Resolved, StudioState } from "./index"

export const SPINNER_DEFAULTS = {
  spinnerStyle: "ring",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveSpinner(_state: StudioState): Resolved {
  return {}
}
