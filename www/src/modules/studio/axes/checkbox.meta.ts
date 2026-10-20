import { CORNER_VALUES, EDGE_VALUES } from "./checkbox"
import { SOURCE_OPTIONS } from "./color.meta"
import { options } from "./core/meta"

export const CORNER_OPTIONS = options(CORNER_VALUES, {
  auto: {
    label: "Auto",
    description: "Follows the corner radius",
    credits: ["shadcn", "Primer", "Polaris", "Untitled UI"],
  },
  sharp: {
    label: "Sharp",
    description: "Fixed 2px corners at any radius",
    credits: ["Material 3", "Carbon", "Fluent 2"],
  },
})

export const EDGE_OPTIONS = options(EDGE_VALUES, {
  fields: {
    label: "Fields",
    description: "The same edge as text fields",
    credits: ["shadcn", "Polaris"],
  },
  strong: {
    label: "Strong",
    description: "A darker edge on checks and radios",
    credits: ["Linear", "Primer"],
  },
})

export const OPTIONS = {
  checkboxColor: SOURCE_OPTIONS,
  checkCorner: CORNER_OPTIONS,
  checkEdge: EDGE_OPTIONS,
}
