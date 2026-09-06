/* Motion — how the system moves. Character is the easing personality every
   entrance shares; Speed is one multiplier over the duration ramp; Overlays
   is the entrance pattern of floating layers; State changes is how long a
   hover/press/selection shift takes to settle — the native-vs-web cue.

   Engine: three `@theme` tokens in base.css — `--ease-enter` and the
   `duration-enter` / `duration-exit` pair every overlay entrance wears — plus
   Tailwind's own `--default-transition-duration`, which every state
   transition without an explicit duration already reads. Overlays is a
   synced `motion` param on popover, tooltip and modal (menu, select and
   pickers ride on popover). Exits keep a plain ease-out curve at a shorter
   duration — springs are for arriving, not leaving. */

import type { Resolved, StudioState } from "./index"

export const MOTION_DEFAULTS = {
  motionCharacter: "standard",
  motionSpeed: "default",
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

export const SPEED = { fast: 0.75, default: 1, relaxed: 1.4 }

/* Smooth mirrors Tailwind's default transition duration. */
export const STATE_MS = { instant: 0, quick: 100, smooth: 150 }

export const CHARACTER_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "emphasized", label: "Emphasized" },
  { value: "spring", label: "Spring" },
]

export const SPEED_OPTIONS = [
  { value: "fast", label: "Fast" },
  { value: "default", label: "Default" },
  { value: "relaxed", label: "Relaxed" },
]

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

const key = <T extends object>(table: T, value: string, fallback: keyof T) =>
  (value in table ? value : fallback) as keyof T

/** The timing a state resolves to: the curve and the three durations. */
export function motionTiming(state: StudioState) {
  const character = CHARACTER[key(CHARACTER, state.motionCharacter, "standard")]
  const speed = SPEED[key(SPEED, state.motionSpeed, "default")]
  const stateMs = STATE_MS[key(STATE_MS, state.motionState, "smooth")]
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
  const motion = OVERLAY_OPTIONS.some((o) => o.value === state.motionOverlay)
    ? state.motionOverlay
    : "scale"
  const selection = { motion }
  return {
    tokens: motionTokens(state),
    params: { popover: selection, tooltip: selection, modal: selection },
  }
}
