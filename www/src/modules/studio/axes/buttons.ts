/* Buttons — the synced family's shared axes: Button sets the look, and the
   Button groups and Toggles sections reuse it. Style is a family look
   reshaping every fill variant at once; the variant enum stays API.

   Engine: `style`, `hover` and `press` are enum params on both `button` and
   `toggle-button` (a synced group — one axis writes both); radius rides on
   the shared `--btn-radius` var. */

import type { Resolved, StudioState } from "./index"
import { pick } from "./pick"

export const BUTTON_DEFAULTS = {
  buttonStyle: "flat",
  buttonRadius: "auto",
  buttonHover: "dim",
  buttonPress: "dim",
}

/* Style families from the Aug 2026 survey: flat (Geist), outline (Primer
   hairline), raised (Radix classic 3D), elevated (Stripe). */
export const STYLE_OPTIONS = [
  { value: "flat", label: "Flat" },
  { value: "outline", label: "Outline" },
  { value: "raised", label: "Raised" },
  { value: "elevated", label: "Elevated" },
]

export const RADIUS_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "sharp", label: "Sharp" },
  { value: "round", label: "Round" },
  { value: "pill", label: "Pill" },
]

/* Hover: of 16 systems surveyed, 14 dim, 2 lighten (Linear, Ant), zero use
   none or lift — dim is the default, lighten is the Linear feel. Press is
   where systems diverge: darker step (8), nothing (5), scale .97
   (Linear/HeroUI/Spectrum pressScale), 1px push (shadcn v4 styles). */
export const HOVER_OPTIONS = [
  { value: "dim", label: "Dim" },
  { value: "lighten", label: "Lighten" },
  { value: "none", label: "None" },
]

export const PRESS_OPTIONS = [
  { value: "dim", label: "Dim" },
  { value: "scale", label: "Scale" },
  { value: "push", label: "Push" },
  { value: "none", label: "None" },
]

const RADIUS_TOKENS: Record<string, string> = {
  sharp: "0",
  round: "var(--radius-lg)",
  pill: "var(--radius-full)",
}

export const WIRED = true

export function resolveButtons(state: StudioState): Resolved {
  const selection = {
    style: pick(STYLE_OPTIONS, state.buttonStyle, "flat"),
    hover: pick(HOVER_OPTIONS, state.buttonHover, "dim"),
    press: pick(PRESS_OPTIONS, state.buttonPress, "dim"),
  }
  const tokens: Record<string, string> = {}
  const radius = RADIUS_TOKENS[state.buttonRadius]
  if (radius) tokens["--btn-radius"] = radius
  return {
    tokens,
    params: { button: selection, "toggle-button": selection },
  }
}
