import { CORNER_VALUES, EDGE_VALUES } from "./checkbox"
import { SOURCE_OPTIONS } from "./color.meta"
import { options } from "./core/meta"

export const CORNER_OPTIONS = options(CORNER_VALUES, {
  auto: { label: "Auto" },
  sharp: { label: "Sharp" },
})

export const EDGE_OPTIONS = options(EDGE_VALUES, {
  fields: { label: "Fields" },
  strong: { label: "Strong" },
})

export const OPTIONS = {
  checkboxColor: SOURCE_OPTIONS,
  checkCorner: CORNER_OPTIONS,
  checkEdge: EDGE_OPTIONS,
}
