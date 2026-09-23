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
import type { ChapterSpec } from "./spec"

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
  {
    value: "standard",
    label: "Standard",
    description:
      "A plain ease-out, cubic-bezier(0, 0, 0.2, 1): entrances in 200ms, " +
      "exits in 150ms.",
    seenIn: ["Carbon"],
  },
  {
    value: "emphasized",
    label: "Emphasized",
    description:
      "A fast start that lingers into place, cubic-bezier(0.05, 0.7, 0.1, " +
      "1): entrances in 280ms, exits in 200ms.",
    seenIn: ["Material 3"],
  },
  {
    value: "spring",
    label: "Spring",
    description:
      "A spring curve that overshoots about 15% and settles: entrances in " +
      "450ms, exits in 200ms on a plain ease-out.",
    seenIn: ["Material 3"],
  },
]

export const SPEED_RANGE = { min: 0.5, max: 2, step: 0.05 }

export const OVERLAY_OPTIONS = [
  {
    value: "none",
    label: "None",
    description: "Popovers, tooltips and dialogs appear and vanish at once.",
  },
  {
    value: "fade",
    label: "Fade",
    description: "An opacity fade only; the layer never moves.",
    seenIn: ["Primer"],
  },
  {
    value: "scale",
    label: "Scale",
    description:
      "Fades in from 95% scale, drifting 2px away from its trigger; dialogs " +
      "scale without the drift.",
    seenIn: ["shadcn/ui", "Radix Themes", "HeroUI", "coss ui"],
  },
  {
    value: "slide",
    label: "Slide",
    description:
      "Fades in while sliding 8px from its trigger at full size; dialogs " +
      "rise 8px from below.",
    seenIn: ["Spectrum 2"],
  },
]

export const STATE_OPTIONS = [
  {
    value: "instant",
    label: "Instant",
    description: "Hover, press and selection colors snap with no transition.",
    seenIn: ["Radix Themes"],
  },
  {
    value: "quick",
    label: "Quick",
    description: "State colors ease over 100ms.",
    seenIn: ["Primer", "Fluent 2", "Carbon", "HeroUI"],
  },
  {
    value: "smooth",
    label: "Smooth",
    description: "State colors ease over 150ms, Tailwind's default.",
    seenIn: ["shadcn/ui", "Geist", "Spectrum 2"],
  },
]

const key = <T extends object>(table: T, value: string, fallback: keyof T) =>
  (value in table ? value : fallback) as keyof T

/** The timing a state resolves to: the curve and the three durations. */
export function motionTiming(state: StudioState) {
  const character = CHARACTER[key(CHARACTER, state.motionCharacter, "standard")]
  const speed =
    typeof state.motionSpeed === "number"
      ? Math.min(SPEED_RANGE.max, Math.max(SPEED_RANGE.min, state.motionSpeed))
      : 1
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

export const MOTION_SPEC = {
  label: "Motion",
  description:
    "How the system moves: the easing and timing of overlay entrances, how " +
    "floating layers enter, and how fast hover, press and selection changes " +
    "settle. Exits always use a plain ease-out at a shorter duration. " +
    "Overlay entrances and exits switch off under the OS reduced-motion " +
    "setting; state-change transitions don't.",
  axes: {
    motionCharacter: {
      label: "Character",
      description:
        "The easing curve every overlay entrance shares, with the base " +
        "entrance and exit durations that suit it.",
      value: { type: "enum", options: CHARACTER_OPTIONS },
      guidance:
        "Standard's curve is Material's legacy decelerate and Tailwind's " +
        "ease-out; Emphasized is Material 3's emphasized decelerate; " +
        "Material 3's Compose motion schemes are springs. Carbon splits " +
        "productive (quick, plain) from expressive (longer, softer); Radix " +
        "Themes uses a strong expo-out at 160ms. Standard suits dense " +
        "tools, Emphasized a considered product feel, Spring a playful " +
        "consumer one.",
    },
    motionSpeed: {
      label: "Speed",
      description:
        "Higher = slower: a multiplier on every duration — entrances, " +
        "exits and state changes. 1× is the character's own timing; 1.25× " +
        "turns Standard's 200ms entrance into 250ms, 0.8× into 160ms.",
      value: { type: "number", unit: "×", ...SPEED_RANGE },
      caution:
        "Higher = slower: 1.2 lengthens every duration by 20%; below 1 is " +
        "faster.",
      guidance:
        "Ant Design exposes the same idea as motionUnit (0.1s), one base " +
        "step all durations scale from. Checked popover entrances run " +
        "100–200ms: shadcn/ui 100ms, HeroUI 150ms, Radix Themes 160ms, " +
        "Primer and Spectrum 2 200ms. Go below 1× (faster) for " +
        "keyboard-driven tools, above (slower) for calm consumer products.",
    },
    motionOverlay: {
      label: "Overlays",
      description:
        "How popovers, menus, selects, tooltips and dialogs enter and " +
        "leave.",
      value: { type: "enum", options: OVERLAY_OPTIONS },
      guidance:
        "Of 6 checked systems, 4 scale and fade (shadcn/ui, Radix Themes, " +
        "HeroUI, coss ui — most add a small slide), Spectrum 2 slides 4px " +
        "and fades without scaling, Primer only fades. None suits systems " +
        "that want no motion at all.",
    },
    motionState: {
      label: "State changes",
      description:
        "How long hover, press and selection color changes take — every " +
        "transition without its own duration. Scaled by Speed.",
      value: { type: "enum", options: STATE_OPTIONS },
      guidance:
        "Checked buttons span 0–200ms: Radix Themes snaps; Carbon (70ms), " +
        "Primer (80ms), Fluent 2 and HeroUI (100ms) ease briefly; shadcn/ui, " +
        "Geist and Spectrum 2 use 150ms; Chakra UI 200ms. Instant reads " +
        "native and crisp, Smooth soft and web-like.",
    },
  },
} satisfies ChapterSpec<typeof MOTION_DEFAULTS>
