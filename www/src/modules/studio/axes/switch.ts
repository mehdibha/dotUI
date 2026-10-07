/* Switch — the track-and-knob recipe (`switch.style`) and its fill, a leaf
   of Color's Primary (Geist's blue toggle beside near-black checkboxes; see
   checkbox.ts). */

import { fillScope, SOURCE_VALUES } from "./color"
import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const SWITCH_DEFAULTS = {
  switchColor: "accent",
  switchStyle: "inset",
}

/* Inset: a filled track, a light knob inside it, stretched on press (iOS,
   shadcn, Radix, Linear, Untitled UI). Outlined: a stroked off-track with a
   small knob that grows and turns light when on (Material 3, Fluent 2,
   Spectrum 2, Polaris). Slab: a rounded-rect track on the controls corner
   with a half-width knob (Primer). */
export const STYLE_VALUES = ["inset", "outlined", "slab"] as const

export const SWITCH_SCHEMA: ChapterSchema<typeof SWITCH_DEFAULTS> = {
  switchColor: oneOf(SOURCE_VALUES),
  switchStyle: oneOf(STYLE_VALUES),
}

export function resolveSwitch(state: Effective): Resolved {
  return {
    params: { switch: { style: state.switchStyle } },
    color: fillScope(state, "switch", state.switchColor),
  }
}

export const chapter = defineChapter({
  id: "switch",
  defaults: SWITCH_DEFAULTS,
  schema: SWITCH_SCHEMA,
  resolve: resolveSwitch,
})
