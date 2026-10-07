/* Selection — what selected text looks like. Engine: `::selection` reads the
   `text-selection` semantic pair, re-pointed at the OS highlight when the
   system leaves it alone. Whether control text selects is States'. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SELECTION_DEFAULTS = {
  selectionHighlight: "accent",
}

export const HIGHLIGHT_VALUES = ["accent", "browser"] as const

export const SELECTION_SCHEMA: ChapterSchema<typeof SELECTION_DEFAULTS> = {
  selectionHighlight: oneOf(HIGHLIGHT_VALUES),
}

export function resolveSelection(state: Effective): Resolved {
  return state.selectionHighlight === "browser"
    ? {
        tokens: {
          "--color-text-selection": "Highlight",
          "--color-fg-on-text-selection": "HighlightText",
        },
      }
    : {}
}

export const chapter = defineChapter({
  id: "selection",
  defaults: SELECTION_DEFAULTS,
  schema: SELECTION_SCHEMA,
  resolve: resolveSelection,
})
