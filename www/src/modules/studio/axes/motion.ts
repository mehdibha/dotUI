/* Motion — how the system moves. Character is the easing personality every
   entrance shares; Speed is one multiplier over the duration ramp (0.5–2×);
   Overlays is the entrance pattern of floating layers; State changes is how long a
   hover/press/selection shift takes to settle — the native-vs-web cue.

   Engine: three `@theme` tokens in base.css — `--ease-enter` and the
   `duration-enter` / `duration-exit` pair every overlay entrance wears — plus
   Tailwind's own `--default-transition-duration`, which every state
   transition without an explicit duration already reads. Overlays is a
   synced `motion` param on popover, tooltip and modal (menu, select and
   pickers ride on popover). Exits keep a plain ease-out curve at a shorter
   duration — springs are for arriving, not leaving. */

import type { Resolved, StudioState } from "./index"
import { oneOf, range } from "./schema"
import type { Schema } from "./schema"

export const MOTION_DEFAULTS = {
  motionCharacter: "standard",
  motionSpeed: 1,
  motionOverlay: "scale",
  motionState: "smooth",
}

/* Jake Archibald-style linear() spring, ~15% overshoot settling over the
   full duration. */
const SPRING =
  "linear(0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.723 12.9%, 0.938 16.7%, 1.017, 1.077 20.4%, 1.121, 1.149 24.3%, 1.159, 1.163 27%, 1.154, 1.129 32.8%, 1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%, 0.974 53.8%, 0.975 57.1%, 0.997 69.8%, 1.003 76.9%, 1)"

/* Character sets the curve and the base durations — emphasized settles
   longer, springs need room to oscillate. Standard mirrors base.css. */
export const CHARACTER = {
  standard: { ease: "cubic-bezier(0, 0, 0.2, 1)", enterMs: 200, exitMs: 150 },
  emphasized: {
    ease: "cubic-bezier(0.05, 0.7, 0.1, 1)",
    enterMs: 280,
    exitMs: 200,
  },
  spring: { ease: SPRING, enterMs: 450, exitMs: 200 },
}

/* Smooth mirrors Tailwind's default transition duration. */
export const STATE_MS = { instant: 0, quick: 100, smooth: 150 }

export const CHARACTER_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "emphasized", label: "Emphasized" },
  { value: "spring", label: "Spring" },
]

export const SPEED_RANGE = { min: 0.5, max: 2, step: 0.05 }

export const OVERLAY_OPTIONS = [
  { value: "none", label: "None" },
  { value: "fade", label: "Fade" },
  { value: "scale", label: "Scale" },
  { value: "slide", label: "Slide" },
]

export const STATE_OPTIONS = [
  { value: "instant", label: "Instant" },
  { value: "quick", label: "Quick" },
  { value: "smooth", label: "Smooth" },
]

export const MOTION_SCHEMA: Schema<typeof MOTION_DEFAULTS> = {
  motionCharacter: oneOf(CHARACTER_OPTIONS),
  motionSpeed: range(SPEED_RANGE),
  motionOverlay: oneOf(OVERLAY_OPTIONS),
  motionState: oneOf(STATE_OPTIONS),
}

/** The timing a state resolves to: the curve and the three durations. */
export function motionTiming(state: StudioState) {
  const character = CHARACTER[state.motionCharacter as keyof typeof CHARACTER]
  const speed = state.motionSpeed
  const stateMs = STATE_MS[state.motionState as keyof typeof STATE_MS]
  return {
    ease: character.ease,
    enterMs: Math.round(character.enterMs * speed),
    exitMs: Math.round(character.exitMs * speed),
    stateMs: Math.round(stateMs * speed),
  }
}

/** The tokens a timing writes — only where it departs from base.css. */
export function motionTokens(state: StudioState): Record<string, string> {
  const timing = motionTiming(state)
  const base = motionTiming(MOTION_DEFAULTS as StudioState)
  const tokens: Record<string, string> = {}
  if (timing.ease !== base.ease) tokens["--ease-enter"] = timing.ease
  if (timing.enterMs !== base.enterMs)
    tokens["--transition-duration-enter"] = `${timing.enterMs}ms`
  if (timing.exitMs !== base.exitMs)
    tokens["--transition-duration-exit"] = `${timing.exitMs}ms`
  if (timing.stateMs !== base.stateMs)
    tokens["--default-transition-duration"] = `${timing.stateMs}ms`
  return tokens
}

export function resolveMotion(state: StudioState): Resolved {
  const selection = { motion: state.motionOverlay }
  return {
    tokens: motionTokens(state),
    params: { popover: selection, tooltip: selection, modal: selection },
  }
}
