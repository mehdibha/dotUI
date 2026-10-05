/* Buttons — the synced family's look: Button sets it, and the toggles,
   groups and segmented control on the same page stay coherent with it. Each
   style is a real system's recipe, copied whole (fills, edges, hover and
   press); the variant enum stays API.

   Engine: `style` is an enum param on both `button` and `toggle-button` (a
   synced group — one axis writes both); radius rides on the shared
   `--studio-btn-radius` var, state timing on the `--studio-button-state-*`
   vars both read. */

import type { Resolved, StudioState } from "./index"
import { resolveStateChange, TAILWIND_TIMING } from "./motion"
import { oneOf, STATE_CHANGE } from "./schema"
import type { ChapterSchema } from "./schema"

/* shadcn's button and toggle: `transition-all` on Tailwind's default timing. */
const MOTION = TAILWIND_TIMING

export const BUTTON_DEFAULTS = {
  buttonStyle: "flat",
  buttonRadius: "auto",
  buttonMotion: MOTION,
}

/* Source-verified in Oct 2026: flat to deep, then Duolingo's slab. */
export const STYLE_OPTIONS = [
  { value: "flat", label: "Flat" },
  { value: "hairline", label: "Hairline", description: "Primer" },
  { value: "rim-light", label: "Rim light", description: "Untitled UI" },
  { value: "gloss", label: "Gloss", description: "Clerk" },
  { value: "bevel", label: "Bevel", description: "Polaris" },
  { value: "ledge", label: "Ledge", description: "Duolingo" },
]

/* Buttons match inputs (Shape's Controls role) unless they go pill — the one
   split real systems make (Material 3, X, Spotify). */
export const RADIUS_OPTIONS = [
  { value: "auto", label: "Inputs" },
  { value: "pill", label: "Pill" },
]

export const BUTTON_SCHEMA: ChapterSchema<typeof BUTTON_DEFAULTS> = {
  buttonStyle: oneOf(STYLE_OPTIONS),
  buttonRadius: oneOf(RADIUS_OPTIONS),
  buttonMotion: STATE_CHANGE,
}

export function resolveButtons(state: StudioState): Resolved {
  const selection = { style: state.buttonStyle }
  const tokens = resolveStateChange("button", state.buttonMotion, MOTION)
  if (state.buttonRadius === "pill") {
    tokens["--studio-btn-radius"] = "var(--radius-full)"
    tokens["--studio-btn-xs-radius"] = "var(--radius-full)"
  }
  return {
    tokens,
    params: { button: selection, "toggle-button": selection },
  }
}
