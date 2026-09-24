/* Pagination — a Buttons follower: page cells are quiet buttons, and the
   current page wears either the primary fill (Primer, GOV.UK, MUI) or the
   secondary outline (shadcn, Ant).

   Engine: `current` is an enum param on `pagination`, folded into the
   active link's button variant. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const PAGINATION_DEFAULTS = {
  paginationCurrent: "outline",
}

export const CURRENT_OPTIONS = [
  {
    value: "filled",
    label: "Filled",
    description:
      "The current page is a primary button — the same solid fill as the " +
      "main call to action.",
    seenIn: ["Mantine"],
  },
  {
    value: "outline",
    label: "Outline",
    description:
      "The current page is a secondary button: a light-gray, bordered cell " +
      "among the borderless quiet ones.",
    seenIn: ["shadcn/ui", "Ant Design"],
  },
]

export function resolvePagination(state: StudioState): Resolved {
  const current = CURRENT_OPTIONS.some(
    (o) => o.value === state.paginationCurrent,
  )
    ? state.paginationCurrent
    : PAGINATION_DEFAULTS.paginationCurrent
  return { params: { pagination: { current } } }
}

export const PAGINATION_SPEC = {
  label: "Pagination",
  description:
    "How the current page stands out in a page-number row. Page cells are " +
    "quiet buttons, so they follow the Buttons chapter's look.",
  axes: {
    paginationCurrent: {
      label: "Pagination",
      description: "Which button variant the current page wears.",
      value: { type: "enum", options: CURRENT_OPTIONS },
      guidance:
        "Mantine fills the current page with the primary color; shadcn " +
        "outlines it, and Ant outlines it with an accent border and accent " +
        "number. Outline keeps a long table footer calm; filled makes the " +
        "position scannable at a glance.",
    },
  },
} satisfies ChapterSpec<typeof PAGINATION_DEFAULTS>
