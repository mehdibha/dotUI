import { options } from "./core/meta"
import { TREATMENT_VALUES } from "./kbd"

export const TREATMENT_OPTIONS = options(TREATMENT_VALUES, {
  chip: {
    label: "Chip",
    description: "A muted fill, no border",
    credits: ["shadcn", "Polaris", "HeroUI", "Notion", "Airbnb"],
  },
  outline: {
    label: "Outline",
    description: "A thin border, no fill",
    credits: ["Claude", "Linear", "Untitled UI", "Duolingo", "Geist"],
  },
  keycap: {
    label: "Keycap",
    description: "A raised key with a thicker bottom edge",
    credits: [
      "Radix Themes (classic)",
      "Primer (approx.)",
      "Chakra (raised)",
      "Mantine",
      "Ant Design",
    ],
  },
})

export const OPTIONS = {
  kbdTreatment: TREATMENT_OPTIONS,
}
