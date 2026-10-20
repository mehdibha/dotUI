import { options } from "./core/meta"
import { ERROR_VALUES, LABEL_VALUES } from "./field"

export const LABEL_OPTIONS = options(LABEL_VALUES, {
  regular: {
    label: "Regular",
    description: "Labels at body text weight",
    credits: ["Ant", "Polaris", "Geist", "Material 3", "Carbon", "Supabase"],
  },
  medium: {
    label: "Medium",
    description: "Slightly heavier labels",
    credits: ["shadcn nova", "Untitled UI", "Claude", "Notion", "Duolingo"],
  },
  semibold: {
    label: "Semibold",
    description: "Bold labels that lead the field",
    credits: ["Primer", "Stripe"],
  },
})

export const ERROR_OPTIONS = options(ERROR_VALUES, {
  plain: {
    label: "Plain",
    description: "Red error text under the field",
    credits: ["shadcn", "Supabase", "Notion", "Duolingo"],
  },
  "icon-message": {
    label: "Icon in message",
    description: "Error text led by an alert icon",
    credits: ["Polaris", "Primer", "Geist"],
  },
  "icon-field": {
    label: "Icon in field",
    description: "Alert icon inside the invalid field",
    credits: ["Carbon", "Material 3", "Untitled UI"],
  },
})

export const OPTIONS = {
  fieldLabel: LABEL_OPTIONS,
  inputError: ERROR_OPTIONS,
}
