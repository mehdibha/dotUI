/* Tooltips — a surface decision of its own: shadcn, Radix and GitHub invert to
   a near-black chip; MUI and Linear keep the tooltip on a bordered surface.
   How it enters is Motion's, shared with the popover.

   Engine: `style` is an enum param on `tooltip`. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const TOOLTIP_DEFAULTS = {
  tooltipStyle: "inverted",
}

export const TOOLTIP_STYLE_OPTIONS = [
  { value: "inverted", label: "Inverted" },
  { value: "surface", label: "Surface" },
]

export const TOOLTIP_SCHEMA: ChapterSchema<typeof TOOLTIP_DEFAULTS> = {
  tooltipStyle: oneOf(TOOLTIP_STYLE_OPTIONS),
}

export function resolveTooltips(state: Effective): Resolved {
  return { params: { tooltip: { style: state.tooltipStyle } } }
}

export const chapter = defineChapter({
  id: "tooltips",
  defaults: TOOLTIP_DEFAULTS,
  schema: TOOLTIP_SCHEMA,
  resolve: resolveTooltips,
})
