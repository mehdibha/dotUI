/* Button groups — how attached segments meet, on Group and Toggle Group (a
   synced pair: one key writes both). Auto reads the secondary's edge: an
   edged one shares it, an edgeless fill takes a divider. Ledge groups sit
   apart (the Buttons resolver writes that), so the seam row is inert there.

   Engine: `separator` enum param on `group` and `toggle-button-group`. */

import { SECONDARY_OPTIONS, STYLE_OPTIONS } from "./buttons"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const BUTTON_GROUP_DEFAULTS = {
  groupSeparator: "auto" as "auto" | "shared-edge" | "divider",
}

export const SEPARATOR_OPTIONS = [
  { value: "auto", label: "Auto", description: "Spectrum 2" },
  {
    value: "shared-edge",
    label: "Shared edge",
    description: "Primer, Polaris, Untitled UI",
  },
  { value: "divider", label: "Divider", description: "Carbon, Supabase" },
]

export const BUTTON_GROUP_SCHEMA: ChapterSchema<typeof BUTTON_GROUP_DEFAULTS> =
  {
    groupSeparator: oneOf(SEPARATOR_OPTIONS.slice(1)),
  }

const EDGELESS = ["soft", "tonal"]

/* Every style's own secondary is edged; Soft and Tonal are not. */
const SEAM_AUTO = Object.fromEntries(
  STYLE_OPTIONS.flatMap(({ value: style }) =>
    SECONDARY_OPTIONS.map(({ value: secondary }) => [
      `${style}|${secondary}`,
      EDGELESS.includes(secondary) ? "divider" : "shared-edge",
    ]),
  ),
)

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
  follows: {
    groupSeparator: [
      {
        kind: "auto",
        id: "auto",
        from: ["buttonStyle", "buttonSecondary"],
        table: SEAM_AUTO,
      },
    ],
  },
  rules: [
    {
      // Ledge groups never attach, so no seam is drawn.
      id: "button-groups/ledge-gaps-groups",
      target: "groupSeparator",
      when: { key: "buttonStyle", in: ["ledge"] },
      effect: { kind: "hide", value: "shared-edge" },
      cause: "buttonStyle",
    },
  ],
})
