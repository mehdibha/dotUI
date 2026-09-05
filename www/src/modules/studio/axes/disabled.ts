import type { Resolved, StudioState } from "./index"

export const DISABLED_DEFAULTS = {
  disabledTreatment: "fade",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveDisabled(_state: StudioState): Resolved {
  return {}
}
