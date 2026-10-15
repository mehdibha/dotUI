import { CORNER_VALUES, EDGE_VALUES } from "./checkbox"
import { SOURCE_OPTIONS } from "./color.meta"
import { options } from "./core/meta"

export const CORNER_OPTIONS = options(CORNER_VALUES, {
  auto: {
    label: "Auto",
    credits: ["shadcn", "Primer", "Polaris", "Untitled UI"],
  },
  sharp: { label: "Sharp", credits: ["Material 3", "Carbon", "Fluent 2"] },
})

export const EDGE_OPTIONS = options(EDGE_VALUES, {
  fields: { label: "Fields", credits: ["shadcn", "Polaris"] },
  strong: { label: "Strong", credits: ["Linear", "Primer"] },
})

export const OPTIONS = {
  checkboxColor: SOURCE_OPTIONS,
  checkCorner: CORNER_OPTIONS,
  checkEdge: EDGE_OPTIONS,
}
