import type { Resolved, StudioState } from "./index"

export const SPACE_DEFAULTS = {
  density: "default",
  /** Tailwind's --spacing, in px. */
  spacingUnit: 4,
  controlSize: "md",
}

/** Whether this chapter's values drive the preview and export yet. */
export const WIRED = false

export function resolveSpace(_state: StudioState): Resolved {
  return {}
}
