import {
  CONTROL_EDGE_VALUES,
  SELECTED_WASH_VALUES,
  SOURCE_VALUES,
} from "./color"
import { options } from "./core/meta"

export const SOURCE_OPTIONS = options(SOURCE_VALUES, {
  neutral: { label: "Neutral" },
  accent: { label: "Accent" },
})

export const CONTROL_EDGE_OPTIONS = options(CONTROL_EDGE_VALUES, {
  soft: { label: "Soft", description: "The hairline — shadcn, Primer, Geist" },
  firm: { label: "Firm", description: "A step firmer — Radix Themes, Linear" },
  strong: {
    label: "Strong",
    description: "A dark gray — Polaris, Atlassian, Material 3",
  },
})

export const SELECTED_WASH_OPTIONS = options(SELECTED_WASH_VALUES, {
  neutral: { label: "Neutral", description: "shadcn, Primer, Polaris, Carbon" },
  brand: { label: "Brand", description: "Material 3, Atlassian, Ant, Linear" },
})

export const OPTIONS = {
  buttonColor: SOURCE_OPTIONS,
  selectionColor: SOURCE_OPTIONS,
  controlEdge: CONTROL_EDGE_OPTIONS,
  selectedWash: SELECTED_WASH_OPTIONS,
}
