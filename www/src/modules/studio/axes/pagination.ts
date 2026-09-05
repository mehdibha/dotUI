import type { Resolved, StudioState } from "./index"

export const PAGINATION_DEFAULTS = {
  paginationCurrent: "filled",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolvePagination(_state: StudioState): Resolved {
  return {}
}
