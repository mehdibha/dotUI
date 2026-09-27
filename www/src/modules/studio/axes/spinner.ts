/* Spinner — the indeterminate loading signature: ring (Material/Carbon/
   shadcn) vs blades (Apple/Geist/Radix Themes) vs dots (HeroUI, chat UIs).

   Motion: one cycle times every style — the ring's turn, on the loop's
   curve; the blades tick round in eight steps and the dots breathe on
   ease-in-out, whatever the curve.

   Engine: `style` is a files-based enum param on `loader` — each value ships
   its own base file — plus its `--studio-loader-loop-*` timing vars. Ring is
   the icon library's own loader glyph, so it follows the Icons chapter. */

import type { Resolved, StudioState } from "./index"
import { ease, resolveLoop } from "./motion"
import type { Loop } from "./motion"

/* shadcn's spinner: Tailwind's `animate-spin`, a 1s linear turn. */
const MOTION: Loop = { cycle: 1000, ease: ease("linear") }

export const SPINNER_DEFAULTS = {
  spinnerStyle: "ring",
  loaderMotion: MOTION,
}

export const STYLE_OPTIONS = [
  { value: "ring", label: "Ring" },
  { value: "blades", label: "Blades" },
  { value: "dots", label: "Dots" },
]

export function resolveSpinner(state: StudioState): Resolved {
  const style = STYLE_OPTIONS.some((o) => o.value === state.spinnerStyle)
    ? state.spinnerStyle
    : SPINNER_DEFAULTS.spinnerStyle
  return {
    tokens: resolveLoop("loader", state.loaderMotion, MOTION),
    params: { loader: { style } },
  }
}
