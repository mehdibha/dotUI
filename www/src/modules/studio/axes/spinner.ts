/* Spinner — the indeterminate loading signature: ring (Material/Carbon/
   shadcn) vs blades (Apple/Geist/Radix Themes) vs dots (HeroUI, chat UIs).

   Engine: `style` is a files-based enum param on `loader` — each value ships
   its own base file. Ring is the icon library's own loader glyph, so it
   follows the Icons chapter. */

import type { Resolved, StudioState } from "./index"

export const SPINNER_DEFAULTS = {
  spinnerStyle: "ring",
}

export const STYLE_OPTIONS = [
  { value: "ring", label: "Ring" },
  { value: "blades", label: "Blades" },
  { value: "dots", label: "Dots" },
]

export const WIRED = true

export function resolveSpinner(state: StudioState): Resolved {
  const style = STYLE_OPTIONS.some((o) => o.value === state.spinnerStyle)
    ? state.spinnerStyle
    : SPINNER_DEFAULTS.spinnerStyle
  return { params: { loader: { style } } }
}
