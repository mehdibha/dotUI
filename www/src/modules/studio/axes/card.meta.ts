import { FOOTER_VALUES } from "./card"
import { options } from "./core/meta"

export const FOOTER_OPTIONS = options(FOOTER_VALUES, {
  none: {
    label: "None",
    credits: [
      "shadcn mira, vega, maia, luma, sera, rhea",
      "Radix Themes",
      "Polaris",
      "Fluent 2",
    ],
  },
  rule: {
    label: "Rule",
    credits: ["shadcn lyra", "Primer", "Supabase", "Untitled UI"],
  },
  band: { label: "Band", credits: ["shadcn nova", "Geist"] },
})

export const OPTIONS = {
  cardFooter: FOOTER_OPTIONS,
}
