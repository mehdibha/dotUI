import {
  CONTROL_EDGE_VALUES,
  SELECTED_WASH_VALUES,
  SOLID_INK_VALUES,
  SOURCE_VALUES,
} from "./color"
import { options } from "./core/meta"

export const SOURCE_OPTIONS = options(SOURCE_VALUES, {
  neutral: {
    label: "Neutral",
    description: "Black, or white in dark mode",
    credits: ["shadcn", "Geist"],
  },
  accent: {
    label: "Accent",
    description: "The brand color",
    credits: ["Material 3", "Radix Themes"],
  },
})

export const CONTROL_EDGE_OPTIONS = options(CONTROL_EDGE_VALUES, {
  soft: {
    label: "Soft",
    description: "Same light line as surface borders",
    credits: ["shadcn", "Primer", "Geist"],
  },
  firm: {
    label: "Firm",
    description: "A step darker than surface borders",
    credits: ["Radix Themes", "Linear"],
  },
  strong: {
    label: "Strong",
    description: "A dark gray, high-contrast edge",
    credits: ["Polaris", "Atlassian", "Material 3"],
  },
  ink: {
    label: "Ink",
    description: "The text color, the darkest edge",
    credits: ["Gumroad", "neobrutalism.dev"],
  },
})

export const SELECTED_WASH_OPTIONS = options(SELECTED_WASH_VALUES, {
  neutral: {
    label: "Neutral",
    description: "Selected rows and tags get a gray wash",
    credits: ["shadcn", "Primer", "Polaris", "Carbon"],
  },
  brand: {
    label: "Brand",
    description: "Selected rows and tags get a brand tint",
    credits: ["Material 3", "Atlassian", "Ant", "Linear"],
  },
})

export const SOLID_INK_OPTIONS = options(SOLID_INK_VALUES, {
  auto: { label: "Auto", description: "Label color picked for contrast" },
  white: {
    label: "White",
    description: "Always white labels, even at low contrast",
    credits: ["Duolingo"],
  },
})

export const OPTIONS = {
  buttonColor: SOURCE_OPTIONS,
  selectionColor: SOURCE_OPTIONS,
  controlEdge: CONTROL_EDGE_OPTIONS,
  selectedWash: SELECTED_WASH_OPTIONS,
  solidInk: SOLID_INK_OPTIONS,
}
