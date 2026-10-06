/* Spinner — the indeterminate loading signature: ring (Material/Carbon/
   shadcn) vs blades (Apple/Geist/Radix Themes) vs dots (HeroUI, chat UIs).
   Each style's loop is its recipe's own.

   Engine: `style` is a files-based enum param on `loader` — each value ships
   its own base file. Ring is the icon library's own loader glyph, so it
   follows the Icons chapter. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SPINNER_DEFAULTS = {
  spinnerStyle: "ring",
}

export const STYLE_OPTIONS = [
  { value: "ring", label: "Ring" },
  { value: "blades", label: "Blades" },
  { value: "dots", label: "Dots" },
]

export const SPINNER_SCHEMA: ChapterSchema<typeof SPINNER_DEFAULTS> = {
  spinnerStyle: oneOf(STYLE_OPTIONS),
}

export function resolveSpinner(state: Effective): Resolved {
  return { params: { loader: { style: state.spinnerStyle } } }
}

export const chapter = defineChapter({
  id: "spinner",
  defaults: SPINNER_DEFAULTS,
  schema: SPINNER_SCHEMA,
  resolve: resolveSpinner,
})
