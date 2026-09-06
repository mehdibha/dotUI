/* Pagination — a Buttons follower: page cells are quiet buttons, and the
   current page wears either the primary fill (Primer, GOV.UK, MUI) or the
   secondary outline (shadcn, Ant).

   Engine: `current` is an enum param on `pagination`, folded into the
   active link's button variant. */

import type { Resolved, StudioState } from "./index"

export const PAGINATION_DEFAULTS = {
  paginationCurrent: "outline",
}

export const CURRENT_OPTIONS = [
  { value: "filled", label: "Filled" },
  { value: "outline", label: "Outline" },
]

export const WIRED = true

export function resolvePagination(state: StudioState): Resolved {
  const current = CURRENT_OPTIONS.some(
    (o) => o.value === state.paginationCurrent,
  )
    ? state.paginationCurrent
    : PAGINATION_DEFAULTS.paginationCurrent
  return { params: { pagination: { current } } }
}
