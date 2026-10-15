import { options } from "./core/meta"
import { NUMBER_LAYOUT_VALUES } from "./number-field"

export const NUMBER_LAYOUT_OPTIONS = options(NUMBER_LAYOUT_VALUES, {
  "right-cells": { label: "Right cells", credits: ["Carbon"] },
  "stacked-cells": {
    label: "Stacked cells",
    credits: ["Ant", "Mantine", "Untitled UI"],
  },
  "stacked-inset": { label: "Stacked inset", credits: ["Polaris"] },
  split: { label: "Split", credits: ["HeroUI", "Airbnb"] },
})

export const OPTIONS = {
  numberLayout: NUMBER_LAYOUT_OPTIONS,
}
