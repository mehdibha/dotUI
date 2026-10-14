import type { RegistryItem } from "@/registry/types"

const colorSwatchMeta = {
  name: "color-swatch",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/color-swatch/base.tsx",
      target: "ui/color-swatch.tsx",
    },
  ],
} satisfies RegistryItem

export default colorSwatchMeta
