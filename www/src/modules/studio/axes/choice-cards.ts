import type { Resolved, StudioState } from "./index"

export const CHOICE_CARD_DEFAULTS = {
  cardSelected: "outline",
  cardControl: "start",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveChoiceCards(_state: StudioState): Resolved {
  return {}
}
