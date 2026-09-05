import type { Resolved, StudioState } from "./index"

export const LINK_DEFAULTS = {
  linkUnderline: "always",
  linkColor: "accent",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveLinks(_state: StudioState): Resolved {
  return {}
}
