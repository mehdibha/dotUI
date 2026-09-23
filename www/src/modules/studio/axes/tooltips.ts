/* Tooltips — a surface decision of its own: shadcn, Radix and GitHub invert to
   a near-black chip; MUI and Linear keep the tooltip on a bordered surface.

   Engine: `style` is an enum param on `tooltip`. */

import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { Schema } from "./schema"

export const TOOLTIP_DEFAULTS = {
  tooltipStyle: "inverted",
}

export const TOOLTIP_STYLE_OPTIONS = [
  { value: "inverted", label: "Inverted" },
  { value: "surface", label: "Surface" },
]

export const TOOLTIP_SCHEMA: Schema<typeof TOOLTIP_DEFAULTS> = {
  tooltipStyle: oneOf(TOOLTIP_STYLE_OPTIONS),
}

export function resolveTooltips(state: StudioState): Resolved {
  return { params: { tooltip: { style: state.tooltipStyle } } }
}
