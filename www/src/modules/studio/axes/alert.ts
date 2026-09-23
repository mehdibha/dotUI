/* Alert — the inline notice. No axes yet: the previous vocabulary was
   dropped and the chapter will be rebuilt from preset evidence. */

import type { Resolved, StudioState } from "./index"
import type { Schema } from "./schema"

export const ALERT_DEFAULTS = {}

export const ALERT_SCHEMA: Schema<typeof ALERT_DEFAULTS> = {}

export function resolveAlert(_state: StudioState): Resolved {
  return {}
}
