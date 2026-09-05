import type { Resolved, StudioState } from "./index"

export const PICKER_DEFAULTS = {
  pickerCaret: "chevron",
  pickerDateTrigger: "field",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolvePickers(_state: StudioState): Resolved {
  return {}
}
