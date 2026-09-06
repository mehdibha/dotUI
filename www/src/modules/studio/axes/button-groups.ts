/* Button groups — the separator between attached segments, shared by Button
   Group and Toggle Group (a synced pair: one axis writes both). Auto lets the
   segments' own edges divide (bordered buttons share a hairline, fills abut),
   divider draws an inset hairline, none fuses the segments.

   Engine: `separator` enum param on `group` and `toggle-button-group`. */

import type { Resolved, StudioState } from "./index"

export const BUTTON_GROUP_DEFAULTS = {
  groupSeparator: "auto",
}

export const SEPARATOR_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "divider", label: "Divider" },
  { value: "none", label: "None" },
]

export function resolveButtonGroups(state: StudioState): Resolved {
  const separator = SEPARATOR_OPTIONS.some(
    (o) => o.value === state.groupSeparator,
  )
    ? state.groupSeparator
    : "auto"
  return {
    params: {
      group: { separator },
      "toggle-button-group": { separator },
    },
  }
}
