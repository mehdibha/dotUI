import type { RegistryItem } from "@/registry/types"

const colorAreaMeta = {
  name: "color-area",
  type: "registry:ui",
  group: "sliders",
  files: [
    {
      type: "registry:ui",
      path: "ui/color-area/base.tsx",
      target: "ui/color-area.tsx",
    },
  ],
  registryDependencies: ["color-thumb"],
} satisfies RegistryItem

export default colorAreaMeta
