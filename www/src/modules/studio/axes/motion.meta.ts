import { options } from "./core/meta"
import { COMPONENT_MOTION_KEYS, ENTRANCE_VALUES, MOTION_VALUES } from "./motion"

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

/** What a component's own Motion row offers first: following the global. */
export const SAME_AS_MOTION = {
  value: "same",
  label: "Same as motion",
  description: "Follows the global Motion",
}

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
    COMPONENT_MOTION_KEYS.map((key) => [key, MOTION_OPTIONS]),
  ),
}
