/* Lists — how in-page lists group their rows. Style: rows on rounded cards
   floating on a tinted canvas (iOS inset grouped, Android settings cards), or
   plain full-bleed rows split by hairlines (Material lists, most web apps).
   Actions: the color of action rows ("Add account") — the brand accent, the
   text's own color, or the selection ramp (iOS apps whose tint is the system
   blue while the brand color stays in the logo).

   Engine: `style` and `tint` are enum params on `list`. */

import type { Resolved, StudioState } from "./index"
import { pick } from "./pick"

export const LIST_DEFAULTS = {
  listStyle: "inset",
  listTint: "accent",
}

export const STYLE_OPTIONS = [
  { value: "inset", label: "Inset grouped" },
  { value: "plain", label: "Plain" },
]

export const TINT_OPTIONS = [
  { value: "accent", label: "Accent" },
  { value: "neutral", label: "Neutral" },
  { value: "selection", label: "Selection" },
]

export function resolveLists(state: StudioState): Resolved {
  return {
    params: {
      list: {
        style: pick(STYLE_OPTIONS, state.listStyle, "inset"),
        tint: pick(TINT_OPTIONS, state.listTint, "accent"),
      },
    },
  }
}
