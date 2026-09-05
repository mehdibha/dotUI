import type { Resolved, StudioState } from "./index"

export const BREADCRUMB_DEFAULTS = {
  breadcrumbSeparator: "chevron",
  breadcrumbTone: "muted",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveBreadcrumbs(_state: StudioState): Resolved {
  return {}
}
