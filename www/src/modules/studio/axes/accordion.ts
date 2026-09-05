import type { Resolved, StudioState } from "./index"

export const ACCORDION_DEFAULTS = {
  accordionContainer: "divided",
  accordionMarker: "chevron",
  accordionMarkerPosition: "trailing",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveAccordion(_state: StudioState): Resolved {
  return {}
}
