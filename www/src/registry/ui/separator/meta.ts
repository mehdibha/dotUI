import type { RegistryItem } from "@/registry/types"

const separatorMeta = {
  name: "separator",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/separator/base.tsx",
      target: "ui/separator.tsx",
    },
  ],
} satisfies RegistryItem

export default separatorMeta
