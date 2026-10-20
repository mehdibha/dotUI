import { options } from "./core/meta"
import { HEADER_LABEL_VALUES, HEADER_VALUES } from "./tables"

export const HEADER_OPTIONS = options(HEADER_VALUES, {
  plain: {
    label: "Plain",
    description: "Header on the table's background",
    credits: [
      "shadcn",
      "Geist",
      "Atlassian",
      "Fluent 2",
      "Catalyst",
      "Chakra (line)",
      "Mantine",
      "Radix Themes (ghost)",
    ],
  },
  filled: {
    label: "Filled",
    description: "Header on a gray band",
    credits: [
      "Polaris",
      "Primer",
      "Carbon",
      "Ant Design",
      "Untitled UI",
      "HeroUI",
    ],
  },
})

export const HEADER_LABEL_OPTIONS = options(HEADER_LABEL_VALUES, {
  strong: {
    label: "Strong",
    description: "Header labels in full-strength text",
    credits: ["shadcn", "Carbon", "Ant Design", "Radix Themes", "Stripe"],
  },
  muted: {
    label: "Muted",
    description: "Header labels in softer gray",
    credits: ["Primer", "Polaris", "shadcn sera", "Material 3", "Notion"],
  },
})

export const OPTIONS = {
  tableHeader: HEADER_OPTIONS,
  tableHeaderLabel: HEADER_LABEL_OPTIONS,
}
