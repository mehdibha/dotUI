import type { RegistryItem } from "@/registry/types"

const colorSwatchPickerMeta = {
  name: "color-swatch-picker",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/color-swatch-picker/base.tsx",
      target: "ui/color-swatch-picker.tsx",
    },
  ],
  registryDependencies: ["color-swatch"],
} satisfies RegistryItem

export default colorSwatchPickerMeta
