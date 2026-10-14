import type { RegistryItem } from "@/registry/types"

const sliderMeta = {
  name: "slider",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/slider/base.tsx",
      target: "ui/slider.tsx",
    },
  ],
  registryDependencies: ["field"],
  dependencies: ["react-aria"],
  params: {
    thumb: {
      default: "circle",
      values: ["circle", "outline", "bar"] as const,
      description: "The knob riding the track.",
    },
    track: {
      default: "thin",
      values: ["thin", "thick"] as const,
      description: "The track weight: a hairline, or a level bar.",
    },
  },
} satisfies RegistryItem

export default sliderMeta
