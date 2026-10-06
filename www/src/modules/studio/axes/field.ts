/* Field — the frame around a field: the label's weight and how an error
   reads. Engine: `field.label`, `field.error` (the icon-message build ships
   a second base file); Icon in field draws on `input.errorIcon`. The field's
   invalid edge is States'. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const FIELD_DEFAULTS = {
  fieldLabel: "regular",
  inputError: "plain",
}

export const LABEL_OPTIONS = [
  {
    value: "regular",
    label: "Regular",
    credits: ["Ant", "Polaris", "Geist", "Material 3", "Carbon", "Supabase"],
  },
  {
    value: "medium",
    label: "Medium",
    credits: ["shadcn nova", "Untitled UI", "Claude", "Notion", "Duolingo"],
  },
  {
    value: "semibold",
    label: "Semibold",
    credits: ["Primer", "Stripe"],
  },
]

export const ERROR_OPTIONS = [
  {
    value: "plain",
    label: "Plain",
    credits: ["shadcn", "Supabase", "Notion", "Duolingo"],
  },
  {
    value: "icon-message",
    label: "Icon in message",
    credits: ["Polaris", "Primer", "Geist"],
  },
  {
    value: "icon-field",
    label: "Icon in field",
    credits: ["Carbon", "Material 3"],
  },
]

export const FIELD_SCHEMA: ChapterSchema<typeof FIELD_DEFAULTS> = {
  fieldLabel: oneOf(LABEL_OPTIONS),
  inputError: oneOf(ERROR_OPTIONS),
}

export function resolveField(state: Effective): Resolved {
  const iconMessage = state.inputError === "icon-message"
  const iconField = state.inputError === "icon-field"
  return {
    params: {
      field: {
        label: state.fieldLabel,
        error: iconMessage ? "icon-message" : "plain",
      },
      input: { errorIcon: iconField ? "inside" : "none" },
    },
  }
}

export const chapter = defineChapter({
  id: "field",
  defaults: FIELD_DEFAULTS,
  schema: FIELD_SCHEMA,
  resolve: resolveField,
})
