import type { Resolved, StudioState } from "./index"

export const TABLE_DEFAULTS = {
  tableSeparation: "lines",
  tableHeader: "plain",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveTables(_state: StudioState): Resolved {
  return {}
}
