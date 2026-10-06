/* Mobile pickers — what selects, menus and date pickers become below the
   mobile line (the `use-mobile` hook's 768px breakpoint; Tailwind's `md`):
   shadcn/Vaul and most product apps slide them into a bottom drawer, Geist
   keeps the popover anchored. `popover.mobile` swaps the shipped popover file.
   Dialogs on mobile live in dialogs.ts. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const MOBILE_DEFAULTS = {
  mobilePickers: "drawer",
}

export const PICKER_OPTIONS = [
  { value: "drawer", label: "Drawer" },
  { value: "popover", label: "Popover" },
]

export const MOBILE_SCHEMA: ChapterSchema<typeof MOBILE_DEFAULTS> = {
  mobilePickers: oneOf(PICKER_OPTIONS),
}

export function resolveMobile(state: Effective): Resolved {
  return {
    params: {
      popover: { mobile: state.mobilePickers },
    },
  }
}

export const chapter = defineChapter({
  id: "mobile",
  defaults: MOBILE_DEFAULTS,
  schema: MOBILE_SCHEMA,
  resolve: resolveMobile,
})
