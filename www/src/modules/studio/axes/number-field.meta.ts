import { options } from "./core/meta"
import { NUMBER_LAYOUT_VALUES } from "./number-field"

export const NUMBER_LAYOUT_OPTIONS = options(NUMBER_LAYOUT_VALUES, {
  "right-cells": {
    label: "Right cells",
    description: "Minus and plus cells at the end",
    credits: ["Carbon"],
  },
  "stacked-cells": {
    label: "Stacked cells",
    description: "Up and down arrows stacked at the end",
    credits: ["Ant", "Mantine", "Untitled UI"],
  },
  "stacked-inset": {
    label: "Stacked inset",
    description: "Stacked arrows as small inset buttons",
    credits: ["Polaris"],
  },
  split: {
    label: "Split",
    description: "Minus at the start, plus at the end",
    credits: ["HeroUI", "Airbnb"],
  },
})

export const OPTIONS = {
  numberLayout: NUMBER_LAYOUT_OPTIONS,
}
