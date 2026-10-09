import type { RegistryItem } from "@/registry/types"

const colorThumbMeta = {
  name: "color-thumb",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/color-thumb/base.tsx",
      target: "ui/color-thumb.tsx",
    },
  ],
} satisfies RegistryItem

export default colorThumbMeta
