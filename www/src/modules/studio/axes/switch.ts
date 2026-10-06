/* Switch — always a pill, so its look is Fill, a leaf of Color's Primary
   (Geist's blue toggle beside near-black checkboxes; see checkbox.ts for the
   mechanism). */

import { fillScope, SOURCE_OPTIONS } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SWITCH_DEFAULTS = {
  switchColor: "accent",
}

export const SWITCH_SCHEMA: ChapterSchema<typeof SWITCH_DEFAULTS> = {
  switchColor: oneOf(SOURCE_OPTIONS),
}

export function resolveSwitch(state: Effective): Resolved {
  return {
    color: fillScope(state, "switch", state.switchColor),
  }
}

export const chapter = defineChapter({
  id: "switch",
  defaults: SWITCH_DEFAULTS,
  schema: SWITCH_SCHEMA,
  resolve: resolveSwitch,
})
