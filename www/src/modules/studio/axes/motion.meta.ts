import { options } from "./core/meta"
import type { Option } from "./core/meta"
import { ENTRANCE_VALUES, FAMILY_MOTION_KEYS, MOTION_VALUES } from "./motion"

export const MOTION_OPTIONS = options(MOTION_VALUES, {
  none: { label: "None", description: "Instant", credits: ["Ant Design"] },
  standard: {
    label: "Standard",
    description: "Quick eased fades",
    credits: ["shadcn"],
  },
  smooth: {
    label: "Smooth",
    description: "Longer expo-out glides",
    credits: ["Radix Themes"],
  },
  expressive: {
    label: "Expressive",
    description: "Springs that overshoot",
    credits: ["Material 3"],
  },
})

export const ENTRANCE_OPTIONS = options(ENTRANCE_VALUES, {
  zoom: { label: "Zoom", credits: ["shadcn"] },
  slide: { label: "Slide", credits: ["Polaris"] },
  fade: { label: "Fade", credits: ["Primer"] },
})

/** A family's own Motion row: the global one first, then its options. */
export const FAMILY_MOTION_OPTIONS: Option[] = [
  { value: "same", label: "Same as Motion" },
  ...MOTION_OPTIONS,
]

export const OPTIONS = {
  motion: MOTION_OPTIONS,
  motionEntrance: ENTRANCE_OPTIONS,
  ...Object.fromEntries(FAMILY_MOTION_KEYS.map((key) => [key, MOTION_OPTIONS])),
}
