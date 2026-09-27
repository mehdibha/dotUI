/* Pagination — a Buttons follower: page cells are quiet buttons, and the
   current page wears either the primary fill (Primer, GOV.UK, MUI) or the
   secondary outline (shadcn, Ant).

   Engine: `current` is an enum param on `pagination`, folded into the
   active link's button variant. */

import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const PAGINATION_DEFAULTS = {
  paginationCurrent: "outline",
}

export const CURRENT_OPTIONS = [
  { value: "filled", label: "Filled" },
  { value: "outline", label: "Outline" },
]

export const PAGINATION_SCHEMA: ChapterSchema<typeof PAGINATION_DEFAULTS> = {
  paginationCurrent: oneOf(CURRENT_OPTIONS),
}

export function resolvePagination(state: StudioState): Resolved {
  return { params: { pagination: { current: state.paginationCurrent } } }
}
