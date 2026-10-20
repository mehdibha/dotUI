/* Selection — what selected text looks like. `::selection` reads the
   `text-selection` semantic pair, re-pointed at the OS highlight when the
   system leaves it alone. Whether control text selects is States'. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const HIGHLIGHT_VALUES = ["accent", "browser"] as const

export const chapter = defineChapter({
  id: "selection",
  defaults: {
    selectionHighlight: "accent",
  },
  schema: {
    selectionHighlight: oneOf(HIGHLIGHT_VALUES),
  },
  resolve(state: Effective): Resolved {
    return state.selectionHighlight === "browser"
      ? {
          tokens: {
            "--color-text-selection": "Highlight",
            "--color-fg-on-text-selection": "HighlightText",
          },
        }
      : {}
  },
})
