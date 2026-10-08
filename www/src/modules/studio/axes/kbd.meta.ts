import { options } from "./core/meta"
import { TREATMENT_VALUES } from "./kbd"

export const TREATMENT_OPTIONS = options(TREATMENT_VALUES, {
  chip: {
    label: "Chip",
    credits: ["shadcn", "Polaris", "HeroUI", "Notion", "Airbnb"],
  },
  outline: {
    label: "Outline",
    credits: ["Claude", "Linear", "Untitled UI", "Duolingo", "Geist"],
  },
  keycap: {
    label: "Keycap",
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
