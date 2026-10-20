import { SOURCE_OPTIONS } from "./color.meta"
import { options } from "./core/meta"
import { MARK_VALUES } from "./radio"

export const MARK_OPTIONS = options(MARK_VALUES, {
  dot: {
    label: "Dot",
    description: "A filled circle with a small center dot",
    credits: ["shadcn", "Primer", "Polaris", "Linear"],
  },
  ring: {
    label: "Ring",
    description: "A colored ring around a colored dot",
    credits: ["Material 3", "Carbon", "Geist", "Supabase"],
  },
})

export const OPTIONS = {
  radioColor: SOURCE_OPTIONS,
  radioMark: MARK_OPTIONS,
}
