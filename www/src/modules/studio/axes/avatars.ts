import type { Resolved, StudioState } from "./index"

export const AVATAR_DEFAULTS = {
  avatarShape: "circle",
  avatarFallback: "tinted",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveAvatars(_state: StudioState): Resolved {
  return {}
}
