import { options } from "./core/meta"
import { ANIMATION_VALUES } from "./skeleton"

export const ANIMATION_OPTIONS = options(ANIMATION_VALUES, {
  shimmer: {
    label: "Shimmer",
    description: "A light sweep across placeholders",
    credits: ["Spectrum 2", "Geist", "Primer", "Carbon", "Fluent 2", "HeroUI"],
  },
  pulse: {
    label: "Pulse",
    description: "Placeholders fade in and out",
    credits: ["shadcn", "Radix Themes", "Mantine", "Chakra"],
  },
  none: {
    label: "Static",
    description: "Placeholders hold still",
    credits: ["Polaris", "Ant Design"],
  },
})

export const OPTIONS = {
  skeletonAnimation: ANIMATION_OPTIONS,
}
