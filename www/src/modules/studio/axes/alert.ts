/* Alert — the inline notice. No axes yet: the previous vocabulary was
   dropped and the chapter will be rebuilt from preset evidence. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import type { ChapterSchema } from "./schema"

export const ALERT_DEFAULTS = {}

export const ALERT_SCHEMA: ChapterSchema<typeof ALERT_DEFAULTS> = {}

export function resolveAlert(_state: Effective): Resolved {
  return {}
}

export const chapter = defineChapter({
  id: "alert",
  defaults: ALERT_DEFAULTS,
  schema: ALERT_SCHEMA,
  resolve: resolveAlert,
})
