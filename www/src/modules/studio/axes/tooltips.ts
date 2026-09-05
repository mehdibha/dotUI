/* Tooltips — a surface decision of its own: shadcn, Radix and GitHub invert to
   a near-black chip; MUI and Linear keep the tooltip on a bordered surface.

   Engine: `style` is an enum param on `tooltip`. */

import type { Resolved, StudioState } from "./index"

export const TOOLTIP_DEFAULTS = {
  tooltipStyle: "inverted",
}

export const TOOLTIP_STYLE_OPTIONS = [
  { value: "inverted", label: "Inverted" },
  { value: "surface", label: "Surface" },
]

export const WIRED = true

export function resolveTooltips(state: StudioState): Resolved {
  const style = TOOLTIP_STYLE_OPTIONS.some(
    (o) => o.value === state.tooltipStyle,
  )
    ? state.tooltipStyle
    : "inverted"
  return { params: { tooltip: { style } } }
}
