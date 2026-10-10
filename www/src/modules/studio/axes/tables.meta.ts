import { options } from "./core/meta"
import { HEADER_LABEL_VALUES, HEADER_VALUES } from "./tables"

export const HEADER_OPTIONS = options(HEADER_VALUES, {
  plain: {
    label: "Plain",
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
    credits: ["shadcn", "Carbon", "Ant Design", "Radix Themes", "Stripe"],
  },
  muted: {
    label: "Muted",
    credits: ["Primer", "Polaris", "shadcn sera", "Material 3", "Notion"],
  },
})

export const OPTIONS = {
  tableHeader: HEADER_OPTIONS,
  tableHeaderLabel: HEADER_LABEL_OPTIONS,
}
