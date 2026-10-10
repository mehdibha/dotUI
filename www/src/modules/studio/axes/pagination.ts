/* Pagination — page cells are quiet buttons; the current one wears the
   secondary button, the primary, or the toggles' selected look.

   Engine: `current` enum param on `pagination`, folded into the active
   link's button variant; under Selected, Button's `current` param carries
   the effective toggle look. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const PAGINATION_DEFAULTS = {
  paginationCurrent: "secondary",
}

export const CURRENT_VALUES = ["secondary", "primary", "selected"] as const

export const PAGINATION_SCHEMA: ChapterSchema<typeof PAGINATION_DEFAULTS> = {
  paginationCurrent: oneOf(CURRENT_VALUES),
}

export function resolvePagination(state: Effective): Resolved {
  const current = state.paginationCurrent
  return {
    params: {
      pagination: { current },
      button: {
        current: current === "selected" ? state.toggleSelected : "none",
      },
    },
  }
}

export const chapter = defineChapter({
  id: "pagination",
  defaults: PAGINATION_DEFAULTS,
  schema: PAGINATION_SCHEMA,
  resolve: resolvePagination,
})
