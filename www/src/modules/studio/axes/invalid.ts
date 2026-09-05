import type { Resolved, StudioState } from "./index"

export const INVALID_DEFAULTS = {
  inputError: "message",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveInvalid(_state: StudioState): Resolved {
  return {}
}
