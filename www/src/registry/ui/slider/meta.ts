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
    "thumb-style": {
      kind: "enum",
      default: "solid",
      values: ["solid", "outline", "bar", "faceted"] as const,
      // description: "Visual style of the slider thumb.",
    },
  },
} satisfies RegistryItem

export default sliderMeta
