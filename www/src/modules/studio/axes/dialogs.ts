import type { Resolved, StudioState } from "./index"

export const DIALOG_DEFAULTS = {
  dialogBackdrop: "dim",
  dialogPosition: "center",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveDialogs(_state: StudioState): Resolved {
  return {}
}
