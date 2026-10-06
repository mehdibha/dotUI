import type { RegistryItem } from "@/registry/types"

const sliderMeta = {
  name: "slider",
  type: "registry:ui",
  group: "sliders",
  files: [
    {
      type: "registry:ui",
      path: "ui/slider/base.tsx",
      target: "ui/slider.tsx",
    },
  ],
  registryDependencies: ["field", "focus-styles"],
  dependencies: ["react-aria"],
  params: {
    thumb: {
      kind: "enum",
      default: "knob",
      values: ["knob", "ring", "solid", "handle"] as const,
      description: "The thumb riding the track.",
    },
    track: {
      kind: "enum",
      default: "thin",
      values: ["hairline", "thin", "medium", "thick"] as const,
      description: "The track weight: 2, 4, 8 or 16px.",
    },
  },
} satisfies RegistryItem

export default sliderMeta
