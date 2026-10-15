/* Mobile — no axes of its own: pickers on mobile are Menus', dialogs on
   mobile are Dialogs'. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import type { ChapterSchema } from "./schema"

export const MOBILE_DEFAULTS = {}

export const MOBILE_SCHEMA: ChapterSchema<typeof MOBILE_DEFAULTS> = {}

export function resolveMobile(_state: Effective): Resolved {
  return {}
}

export const chapter = defineChapter({
  id: "mobile",
  defaults: MOBILE_DEFAULTS,
  schema: MOBILE_SCHEMA,
  resolve: resolveMobile,
})
