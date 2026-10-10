import { options } from "./core/meta"
import type { OptionMeta } from "./core/meta"
import {
  COMPONENT_MOTION_KEYS,
  COMPONENT_MOTION_VALUES,
  ENTRANCE_VALUES,
  MOTION_VALUES,
} from "./motion"
import type { ComponentMotionKey } from "./motion"

const TEMPOS: Record<(typeof COMPONENT_MOTION_VALUES)[number], OptionMeta> = {
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
}

export const MOTION_OPTIONS = options(MOTION_VALUES, TEMPOS)

export const COMPONENT_MOTION_OPTIONS = options(COMPONENT_MOTION_VALUES, TEMPOS)

/** What a component's own Motion row offers first: following the global. */
export const SAME_AS_MOTION = { value: "same", label: "Same as motion" }

/** Each component Motion's component, as its row names it. */
export const MOTION_COMPONENTS: Record<ComponentMotionKey, string> = {
  buttonMotion: "Button",
  segmentedMotion: "Segmented control",
  fieldMotion: "Field",
  checkboxMotion: "Checkbox",
  switchMotion: "Switch",
  sliderMotion: "Slider",
  popoverMotion: "Popover",
  tooltipMotion: "Tooltip",
  dialogMotion: "Dialog",
  sheetMotion: "Sheet",
  tabsMotion: "Tabs",
  sidebarMotion: "Sidebar",
  linkMotion: "Link",
  tableMotion: "Table",
  accordionMotion: "Accordion",
  calendarMotion: "Calendar",
  toastMotion: "Toast",
  progressMotion: "Progress",
}

export const ENTRANCE_OPTIONS = options(ENTRANCE_VALUES, {
  zoom: { label: "Zoom", credits: ["shadcn"] },
  slide: { label: "Slide", credits: ["Polaris"] },
  fade: { label: "Fade", credits: ["Primer"] },
})

export const OPTIONS = {
  motion: MOTION_OPTIONS,
  popoverEntrance: ENTRANCE_OPTIONS,
  tooltipEntrance: ENTRANCE_OPTIONS,
  ...Object.fromEntries(
    COMPONENT_MOTION_KEYS.map((key) => [key, COMPONENT_MOTION_OPTIONS]),
  ),
}
