import { EDGE_VALUES } from "./card"
import { options } from "./core/meta"

export const CARD_HEADER_OPTIONS = options(EDGE_VALUES, {
  none: {
    label: "None",
    description: "Header flows into the content",
    credits: ["shadcn"],
  },
  rule: {
    label: "Rule",
    description: "A line under the header",
    credits: ["Supabase"],
  },
  band: {
    label: "Band",
    description: "Tinted header strip with a line under it",
    credits: ["Primer"],
  },
})

export const FOOTER_OPTIONS = options(EDGE_VALUES, {
  none: {
    label: "None",
    description: "Footer flows from the content",
    credits: [
      "shadcn mira, vega, maia, luma, sera, rhea",
      "Radix Themes",
      "Polaris",
      "Fluent 2",
    ],
  },
  rule: {
    label: "Rule",
    description: "A line above the footer",
    credits: ["shadcn lyra", "Primer", "Supabase", "Untitled UI"],
  },
  band: {
    label: "Band",
    description: "Tinted footer strip with a line above it",
    credits: ["shadcn nova", "Geist"],
  },
})

export const OPTIONS = {
  cardHeader: CARD_HEADER_OPTIONS,
  cardFooter: FOOTER_OPTIONS,
}
