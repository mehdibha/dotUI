import { options } from "./core/meta"
import type { OptionMeta } from "./core/meta"
import {
  COMPONENT_MOTION_KEYS,
  COMPONENT_MOTION_VALUES,
  customKeys,
  EASE_VALUES,
  ENTRANCE_VALUES,
  MOTION_VALUES,
  ROLE_OF,
} from "./motion"
import type { ComponentMotionKey, Role } from "./motion"

export const MOTION_OPTIONS = options(MOTION_VALUES, {
  none: {
    label: "None",
    description: "No animation, changes are instant",
    credits: ["Ant Design"],
  },
  standard: {
    label: "Standard",
    description: "Quick, even transitions",
    credits: ["shadcn"],
  },
  smooth: {
    label: "Smooth",
    description: "Slower and softer, gliding to a stop",
    credits: ["Radix Themes"],
  },
  expressive: {
    label: "Expressive",
    description: "Springy, with a little bounce",
    credits: ["Material 3"],
  },
})

type Preset = (typeof COMPONENT_MOTION_VALUES)[number]

const CUSTOM = {
  label: "Custom",
  description: "Your own duration and easing",
}

/* A component's presets are the tempos, named for what they do to it. */
const PRESETS: Record<
  Exclude<Role, "swipe">,
  Record<Exclude<Preset, "custom">, OptionMeta>
> = {
  micro: {
    none: { label: "Instant", description: "States change at once" },
    standard: {
      label: "Quick",
      description: "A short, even fade between states",
    },
    smooth: { label: "Soft", description: "Eases gently into each state" },
    expressive: {
      label: "Springy",
      description: "A stiff spring, quick and lively",
    },
  },
  travel: {
    none: { label: "Jump", description: "Moves into place at once" },
    standard: { label: "Slide", description: "Slides across at an even pace" },
    smooth: { label: "Glide", description: "Glides, easing in and out" },
    expressive: {
      label: "Bounce",
      description: "Overshoots a touch, then settles",
    },
  },
  layout: {
    none: { label: "Instant", description: "Opens and collapses at once" },
    standard: { label: "Slide", description: "Slides at a steady pace" },
    smooth: { label: "Glide", description: "Moves fast, easing to a stop" },
    expressive: {
      label: "Spring",
      description: "Springs open with a soft settle",
    },
  },
  anchored: {
    none: { label: "Instant", description: "Opens at once" },
    standard: { label: "Quick", description: "Opens in a short, even ease" },
    smooth: { label: "Glide", description: "Opens fast, easing to a stop" },
    expressive: {
      label: "Spring",
      description: "Springs open with a soft settle",
    },
  },
  hint: {
    none: { label: "Instant", description: "Shows at once" },
    standard: { label: "Fade", description: "Fades in at an even pace" },
    smooth: { label: "Glide", description: "Fades in fast, easing to a stop" },
    expressive: {
      label: "Spring",
      description: "Springs in with a soft settle",
    },
  },
  modal: {
    none: { label: "Instant", description: "Opens at once" },
    standard: { label: "Quick", description: "Opens in a short, even ease" },
    smooth: { label: "Glide", description: "Opens fast, easing to a stop" },
    expressive: {
      label: "Spring",
      description: "Springs in with a soft settle",
    },
  },
  disclosure: {
    none: { label: "Instant", description: "Expands at once" },
    standard: { label: "Expand", description: "Opens quickly, easing out" },
    smooth: { label: "Smooth", description: "Opens slowly, easing in and out" },
    expressive: { label: "Spring", description: "Springs open, no bounce" },
  },
  notification: {
    none: { label: "Instant", description: "Appears at once" },
    standard: { label: "Slide", description: "Slides in at an even pace" },
    smooth: { label: "Snap", description: "Slides in fast, easing to a stop" },
    expressive: {
      label: "Spring",
      description: "Springs in with a soft settle",
    },
  },
}

/** A component's presets, then Custom. */
export const presetOptions = (key: ComponentMotionKey) =>
  options(COMPONENT_MOTION_VALUES, { ...PRESETS[ROLE_OF[key]], custom: CUSTOM })

export const EASE_OPTIONS = options(EASE_VALUES, {
  linear: { label: "Linear", description: "An even pace, start to end" },
  ease: { label: "Ease", description: "Quick, then gentle" },
  "ease-in": { label: "Ease in", description: "Starts slow, ends fast" },
  "ease-out": {
    label: "Ease out",
    description: "Starts fast, slows to a stop",
  },
  "ease-in-out": { label: "Ease in-out", description: "Slow at both ends" },
  standard: {
    label: "Standard",
    description: "A quick start, a long gentle stop",
  },
  "expo-out": {
    label: "Expo out",
    description: "A sharp start, a long glide to a stop",
  },
  "expo-in-out": {
    label: "Expo in-out",
    description: "Slow, then fast, then slow",
  },
  spring: { label: "Spring", description: "Settles like a spring, no bounce" },
  bouncy: { label: "Bouncy", description: "Overshoots, then settles" },
})

export const ENTRANCE_OPTIONS = options(ENTRANCE_VALUES, {
  zoom: {
    label: "Zoom",
    description: "Grows slightly as it fades in",
    credits: ["shadcn"],
  },
  slide: {
    label: "Slide",
    description: "Slides in from its trigger as it fades in",
    credits: ["Polaris"],
  },
  fade: {
    label: "Fade",
    description: "Fades in place, without moving",
    credits: ["Primer"],
  },
})

export const OPTIONS = {
  motion: MOTION_OPTIONS,
  popoverEntrance: ENTRANCE_OPTIONS,
  tooltipEntrance: ENTRANCE_OPTIONS,
  ...Object.fromEntries(
    COMPONENT_MOTION_KEYS.flatMap((key) => [
      [key, presetOptions(key)],
      [customKeys(key).ease, EASE_OPTIONS],
    ]),
  ),
}
