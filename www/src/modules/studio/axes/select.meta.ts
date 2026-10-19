import { options } from "./core/meta"
import { CARET_VALUES, TRIGGER_VALUES } from "./select"

export const TRIGGER_OPTIONS = options(TRIGGER_VALUES, {
  field: {
    label: "Field",
    description: "Looks like a text input",
    credits: ["shadcn", "Geist", "Polaris", "Carbon", "Material 3", "Primer"],
  },
  button: {
    label: "Button",
    description: "Looks like a button",
    credits: ["Linear", "Supabase", "Stripe", "Notion", "Duolingo"],
  },
})

export const CARET_OPTIONS = options(CARET_VALUES, {
  chevron: {
    label: "Chevron",
    description: "A single down chevron",
    credits: ["shadcn", "Geist", "Carbon", "Radix Themes", "Untitled UI"],
  },
  double: {
    label: "Double",
    description: "Up and down chevrons",
    credits: ["Polaris", "Primer", "Stripe"],
  },
})

export const OPTIONS = {
  selectTrigger: TRIGGER_OPTIONS,
  pickerCaret: CARET_OPTIONS,
}
