/* Button groups — the separator between attached segments, shared by Button
   Group and Toggle Group (a synced pair: one axis writes both). Auto lets the
   segments' own edges divide (bordered buttons share a hairline, fills abut),
   divider draws an inset hairline, none fuses the segments.

   Engine: `separator` enum param on `group` and `toggle-button-group`. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const BUTTON_GROUP_DEFAULTS = {
  groupSeparator: "auto",
}

export const SEPARATOR_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "divider", label: "Divider" },
  { value: "none", label: "None" },
]

export const BUTTON_GROUP_SCHEMA: ChapterSchema<typeof BUTTON_GROUP_DEFAULTS> =
  {
    groupSeparator: oneOf(SEPARATOR_OPTIONS),
  }

export function resolveButtonGroups(state: Effective): Resolved {
  const separator = state.groupSeparator
  return {
    params: {
      group: { separator },
      "toggle-button-group": { separator },
    },
  }
}

export const chapter = defineChapter({
  id: "button-groups",
  defaults: BUTTON_GROUP_DEFAULTS,
  schema: BUTTON_GROUP_SCHEMA,
  resolve: resolveButtonGroups,
})
