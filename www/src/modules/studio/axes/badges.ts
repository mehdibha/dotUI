import type { Resolved, StudioState } from "./index"

export const BADGE_DEFAULTS = {
  badgeStyle: "soft",
  badgeShape: "pill",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveBadges(_state: StudioState): Resolved {
  return {}
}
