import type { Resolved, StudioState } from "./index"

export const NUMBER_FIELD_DEFAULTS = {
  numberLayout: "right",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveNumberField(_state: StudioState): Resolved {
  return {}
}
