/* Button groups — how attached segments meet, on Group and Toggle Group (a
   synced pair: one key writes both). Auto reads the secondary's edge: an
   edged one shares it, an edgeless fill takes a divider. Chunky groups sit
   apart (the Buttons resolver writes that), so the seam row is inert there. */

import { SECONDARY_VALUES } from "./buttons"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const SEPARATOR_VALUES = ["shared-edge", "divider"] as const

const EDGELESS = ["soft", "tonal", "solid"]

/* Every look's own secondary is edged; Soft, Tonal and Solid are not. */
const SEAM_AUTO = Object.fromEntries(
  SECONDARY_VALUES.map((secondary) => [
    secondary,
    EDGELESS.includes(secondary) ? "divider" : "shared-edge",
  ]),
)

export const chapter = defineChapter({
  id: "button-groups",
  defaults: {
    groupSeparator: "auto" as "auto" | "shared-edge" | "divider",
  },
  schema: {
    groupSeparator: oneOf(SEPARATOR_VALUES),
  },
  resolve(state: Effective): Resolved {
    const separator = state.groupSeparator
    return {
      params: {
        group: { separator },
        "toggle-button-group": { separator },
      },
    }
  },
  follows: {
    groupSeparator: [
      {
        kind: "auto",
        id: "auto",
        from: "buttonSecondary",
        table: SEAM_AUTO,
      },
    ],
  },
  rules: [
    {
      // Chunky groups never attach, so no seam is drawn.
      id: "button-groups/ledge-gaps-groups",
      target: "groupSeparator",
      when: { key: "style", in: ["chunky"] },
      effect: { kind: "hide", value: "shared-edge" },
      cause: "style",
    },
  ],
})
