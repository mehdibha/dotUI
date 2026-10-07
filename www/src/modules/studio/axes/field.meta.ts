import { options } from "./core/meta"
import { ERROR_VALUES, LABEL_VALUES } from "./field"

export const LABEL_OPTIONS = options(LABEL_VALUES, {
  regular: {
    label: "Regular",
    credits: ["Ant", "Polaris", "Geist", "Material 3", "Carbon", "Supabase"],
  },
  medium: {
    label: "Medium",
    credits: ["shadcn nova", "Untitled UI", "Claude", "Notion", "Duolingo"],
  },
  semibold: { label: "Semibold", credits: ["Primer", "Stripe"] },
})

export const ERROR_OPTIONS = options(ERROR_VALUES, {
  plain: {
    label: "Plain",
    credits: ["shadcn", "Supabase", "Notion", "Duolingo"],
  },
  "icon-message": {
    label: "Icon in message",
    credits: ["Polaris", "Primer", "Geist"],
  },
  "icon-field": {
    label: "Icon in field",
    credits: ["Carbon", "Material 3", "Untitled UI"],
  },
})

export const OPTIONS = {
  fieldLabel: LABEL_OPTIONS,
  inputError: ERROR_OPTIONS,
}
