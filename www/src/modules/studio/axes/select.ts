/* Select — what draws the trigger and its caret. Engine: `select.trigger`
   swaps the shipped base file (a Button, or the field shell); `select.caret`
   swaps the glyph (select/meta.ts `source`). */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SELECT_DEFAULTS = {
  selectTrigger: "button",
  pickerCaret: "chevron",
}

export const TRIGGER_OPTIONS = [
  {
    value: "field",
    label: "Field",
    credits: ["shadcn", "Geist", "Polaris", "Carbon", "Material 3", "Primer"],
  },
  {
    value: "button",
    label: "Button",
    credits: ["Linear", "Supabase", "Stripe", "Notion", "Duolingo"],
  },
]

export const CARET_OPTIONS = [
  {
    value: "chevron",
    label: "Chevron",
    credits: ["shadcn", "Geist", "Carbon", "Radix Themes", "Untitled UI"],
  },
  {
    value: "double",
    label: "Double",
    credits: ["Polaris", "Primer", "Stripe"],
  },
]

export const SELECT_SCHEMA: ChapterSchema<typeof SELECT_DEFAULTS> = {
  selectTrigger: oneOf(TRIGGER_OPTIONS),
  pickerCaret: oneOf(CARET_OPTIONS),
}

export function resolveSelect(state: Effective): Resolved {
  return {
    params: {
      select: { trigger: state.selectTrigger, caret: state.pickerCaret },
    },
  }
}

export const chapter = defineChapter({
  id: "select",
  defaults: SELECT_DEFAULTS,
  schema: SELECT_SCHEMA,
  resolve: resolveSelect,
})
