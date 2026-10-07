import { options } from "./core/meta"
import { ANIMATION_VALUES } from "./skeleton"

export const ANIMATION_OPTIONS = options(ANIMATION_VALUES, {
  shimmer: {
    label: "Shimmer",
    description: "Spectrum 2, Geist, Primer, Carbon, Fluent 2, HeroUI",
  },
  pulse: {
    label: "Pulse",
    description: "shadcn, Radix Themes, Mantine, Chakra",
  },
  none: { label: "None", description: "Polaris, Ant Design" },
})

export const OPTIONS = {
  skeletonAnimation: ANIMATION_OPTIONS,
}
