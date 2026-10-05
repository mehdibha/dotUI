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

/* Source-verified in Oct 2026: flat to deep, then the two hard-shadow looks. */
export const STYLE_OPTIONS = [
  { value: "flat", label: "Flat" },
  { value: "hairline", label: "Hairline", description: "Primer" },
  { value: "rim-light", label: "Rim light", description: "Untitled UI" },
  { value: "gloss", label: "Gloss", description: "Clerk" },
  { value: "bevel", label: "Bevel", description: "Polaris" },
  { value: "offset", label: "Offset", description: "Gumroad" },
  { value: "ledge", label: "Ledge", description: "Duolingo" },
]

export const RADIUS_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "sharp", label: "Sharp" },
  { value: "round", label: "Round" },
  { value: "pill", label: "Pill" },
]

const RADIUS_TOKENS: Record<string, string> = {
  sharp: "0",
  round: "var(--radius-lg)",
  pill: "var(--radius-full)",
}

export const BUTTON_SCHEMA: ChapterSchema<typeof BUTTON_DEFAULTS> = {
  buttonStyle: oneOf(STYLE_OPTIONS),
  buttonRadius: oneOf(RADIUS_OPTIONS),
  buttonMotion: STATE_CHANGE,
}

export function resolveButtons(state: StudioState): Resolved {
  const selection = { style: state.buttonStyle }
  const tokens = resolveStateChange("button", state.buttonMotion, MOTION)
  const radius = RADIUS_TOKENS[state.buttonRadius]
  if (radius) tokens["--studio-btn-radius"] = radius
  return {
    tokens,
    params: { button: selection, "toggle-button": selection },
  }
}
