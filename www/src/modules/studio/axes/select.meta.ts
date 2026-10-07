import { options } from "./core/meta"
import { CARET_VALUES, TRIGGER_VALUES } from "./select"

export const TRIGGER_OPTIONS = options(TRIGGER_VALUES, {
  field: {
    label: "Field",
    credits: ["shadcn", "Geist", "Polaris", "Carbon", "Material 3", "Primer"],
  },
  button: {
    label: "Button",
    credits: ["Linear", "Supabase", "Stripe", "Notion", "Duolingo"],
  },
})

export const CARET_OPTIONS = options(CARET_VALUES, {
  chevron: {
    label: "Chevron",
    credits: ["shadcn", "Geist", "Carbon", "Radix Themes", "Untitled UI"],
  },
  double: { label: "Double", credits: ["Polaris", "Primer", "Stripe"] },
})

export const OPTIONS = {
  selectTrigger: TRIGGER_OPTIONS,
  pickerCaret: CARET_OPTIONS,
}
