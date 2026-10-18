/* Breadcrumbs — the separator glyph and how ancestors read: muted labels
   that sharpen on hover, or links in the link recipe. The current crumb is
   plain foreground either way. `ancestors` folds in the link color and
   underline. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const SEPARATOR_VALUES = ["chevron", "slash"] as const

export const ANCESTOR_VALUES = ["muted", "link"] as const

export const chapter = defineChapter({
  id: "breadcrumbs",
  defaults: {
    breadcrumbSeparator: "chevron",
    breadcrumbTone: "muted",
  },
  schema: {
    breadcrumbSeparator: oneOf(SEPARATOR_VALUES),
    breadcrumbTone: oneOf(ANCESTOR_VALUES),
  },
  resolve(state: Effective): Resolved {
    return {
      params: {
        breadcrumbs: {
          separator: state.breadcrumbSeparator,
          ancestors:
            state.breadcrumbTone === "link"
              ? `${state.linkColor}-${state.linkUnderline}`
              : "muted",
        },
      },
    }
  },
})
