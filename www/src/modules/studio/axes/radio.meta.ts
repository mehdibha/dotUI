import { SOURCE_OPTIONS } from "./color.meta"
import { options } from "./core/meta"
import { MARK_VALUES } from "./radio"

export const MARK_OPTIONS = options(MARK_VALUES, {
  dot: { label: "Dot" },
  ring: { label: "Ring" },
})

export const OPTIONS = {
  radioColor: SOURCE_OPTIONS,
  radioMark: MARK_OPTIONS,
}
