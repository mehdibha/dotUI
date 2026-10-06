/* Mobile — no axes of its own: pickers on mobile are Menus', dialogs on
   mobile are Dialogs'. */

import { defineChapter } from "./core/types"
import type { Resolved } from "./index"
import type { ChapterSchema } from "./schema"

export const MOBILE_DEFAULTS = {}

export const MOBILE_SCHEMA: ChapterSchema<typeof MOBILE_DEFAULTS> = {}

export function resolveMobile(): Resolved {
  return {}
}

export const chapter = defineChapter({
  id: "mobile",
  defaults: MOBILE_DEFAULTS,
  schema: MOBILE_SCHEMA,
  resolve: resolveMobile,
})
