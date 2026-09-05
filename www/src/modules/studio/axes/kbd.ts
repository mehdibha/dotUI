import type { Resolved, StudioState } from "./index"

export const KBD_DEFAULTS = {
  kbdTreatment: "chip",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveKbd(_state: StudioState): Resolved {
  return {}
}
