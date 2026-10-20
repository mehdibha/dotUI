import { options } from "./core/meta"
import { TOOLTIP_STYLE_VALUES } from "./tooltips"

export const TOOLTIP_STYLE_OPTIONS = options(TOOLTIP_STYLE_VALUES, {
  inverted: {
    label: "Inverted",
    description: "A high-contrast chip, opposite the page",
    credits: ["shadcn", "Geist", "Duolingo"],
  },
  surface: {
    label: "Same as popovers",
    description: "Popover surface, edge and shadow",
    credits: ["Linear", "Polaris", "Supabase"],
  },
})

export const OPTIONS = {
  tooltipStyle: TOOLTIP_STYLE_OPTIONS,
}
