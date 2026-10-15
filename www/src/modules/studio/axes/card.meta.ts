import { FOOTER_VALUES, HEADER_VALUES } from "./card"
import { options } from "./core/meta"

export const CARD_HEADER_OPTIONS = options(HEADER_VALUES, {
  none: { label: "None", credits: ["shadcn"] },
  rule: { label: "Rule", credits: ["Supabase"] },
  band: { label: "Band", credits: ["Primer"] },
})

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
  cardHeader: CARD_HEADER_OPTIONS,
  cardFooter: FOOTER_OPTIONS,
}
