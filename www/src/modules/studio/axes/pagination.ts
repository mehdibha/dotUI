/* Pagination — page cells are quiet buttons; the current one wears the
   secondary button, the primary, or the toggles' selected look.

   `pagination.current` folds into the active link's button variant; under Selected, Button's `current` param carries
   the effective toggle look. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const CURRENT_VALUES = ["secondary", "primary", "selected"] as const

export const chapter = defineChapter({
  id: "pagination",
  defaults: {
    paginationCurrent: "secondary",
  },
  schema: {
    paginationCurrent: oneOf(CURRENT_VALUES),
  },
  resolve(state: Effective): Resolved {
    const current = state.paginationCurrent
    return {
      params: {
        pagination: { current },
        button: {
          current: current === "selected" ? state.toggleSelected : "none",
        },
      },
    }
  },
})
