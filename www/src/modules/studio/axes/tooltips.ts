/* Tooltips: the one anchored layer that breaks rank with the popover
   material. Whether it points is Menus' Arrows row; how it enters, Motion's.

   Engine: `style` is an enum param on `tooltip`. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const TOOLTIP_DEFAULTS = {
  tooltipStyle: "inverted",
}

export const TOOLTIP_STYLE_OPTIONS = [
  {
    value: "inverted",
    label: "Inverted",
    description: "shadcn, Geist, Duolingo",
  },
  {
    value: "surface",
    label: "Same as popovers",
    description: "Linear, Polaris, Supabase",
  },
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
