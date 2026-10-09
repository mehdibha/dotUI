import type { RegistryItem } from "@/registry/types"

const colorSliderMeta = {
  name: "color-slider",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/color-slider/base.tsx",
      target: "ui/color-slider.tsx",
    },
  ],
  registryDependencies: ["field", "color-thumb"],
} satisfies RegistryItem

export default colorSliderMeta
