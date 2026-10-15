import { options } from "./core/meta"
import { TOOLTIP_STYLE_VALUES } from "./tooltips"

export const TOOLTIP_STYLE_OPTIONS = options(TOOLTIP_STYLE_VALUES, {
  inverted: { label: "Inverted", credits: ["shadcn", "Geist", "Duolingo"] },
  surface: {
    label: "Same as popovers",
    credits: ["Linear", "Polaris", "Supabase"],
  },
})

export const OPTIONS = {
  tooltipStyle: TOOLTIP_STYLE_OPTIONS,
}
