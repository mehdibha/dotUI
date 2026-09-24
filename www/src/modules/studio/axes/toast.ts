/* Toast — the floating notice. No axes yet: the previous vocabulary was
   dropped and the chapter will be rebuilt from preset evidence. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSchema } from "./schema"

export const TOAST_DEFAULTS = {}

export const TOAST_SCHEMA: ChapterSchema<typeof TOAST_DEFAULTS> = {}

export function resolveToast(_state: StudioState): Resolved {
  return {}
}
