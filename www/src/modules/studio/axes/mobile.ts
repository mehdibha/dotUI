/* Mobile — no axes of its own: pickers on mobile are Menus', dialogs on
   mobile are Dialogs'. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"

export const chapter = defineChapter({
  id: "mobile",
  defaults: {},
  schema: {},
  resolve(_state: Effective): Resolved {
    return {}
  },
})
