/* Alert — the inline notice. No axes yet: the previous vocabulary was
   dropped and the chapter will be rebuilt from preset evidence. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSchema } from "./schema"

export const ALERT_DEFAULTS = {}

export const ALERT_SCHEMA: ChapterSchema<typeof ALERT_DEFAULTS> = {}

export function resolveAlert(_state: StudioState): Resolved {
  return {}
}
