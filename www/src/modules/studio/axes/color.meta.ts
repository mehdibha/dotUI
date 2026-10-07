import {
  CONTROL_EDGE_VALUES,
  SELECTED_WASH_VALUES,
  SOLID_INK_VALUES,
  SOURCE_VALUES,
} from "./color"
import { options } from "./core/meta"

export const SOURCE_OPTIONS = options(SOURCE_VALUES, {
  neutral: { label: "Neutral" },
  accent: { label: "Accent" },
})

export const CONTROL_EDGE_OPTIONS = options(CONTROL_EDGE_VALUES, {
  soft: {
    label: "Soft",
    description: "The hairline",
    credits: ["shadcn", "Primer", "Geist"],
  },
  firm: {
    label: "Firm",
    description: "A step firmer",
    credits: ["Radix Themes", "Linear"],
  },
  strong: {
    label: "Strong",
    description: "A dark gray",
    credits: ["Polaris", "Atlassian", "Material 3"],
  },
})

export const SELECTED_WASH_OPTIONS = options(SELECTED_WASH_VALUES, {
  neutral: {
    label: "Neutral",
    credits: ["shadcn", "Primer", "Polaris", "Carbon"],
  },
  brand: {
    label: "Brand",
    credits: ["Material 3", "Atlassian", "Ant", "Linear"],
  },
})

export const SOLID_INK_OPTIONS = options(SOLID_INK_VALUES, {
  auto: { label: "Auto" },
  white: { label: "White", credits: ["Duolingo"] },
})

export const OPTIONS = {
  buttonColor: SOURCE_OPTIONS,
  selectionColor: SOURCE_OPTIONS,
  controlEdge: CONTROL_EDGE_OPTIONS,
  selectedWash: SELECTED_WASH_OPTIONS,
  solidInk: SOLID_INK_OPTIONS,
}
