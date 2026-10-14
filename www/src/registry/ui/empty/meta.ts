import type { RegistryItem } from "@/registry/types"

const emptyMeta = {
  name: "empty",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/empty/base.tsx",
      target: "ui/empty.tsx",
    },
  ],
} satisfies RegistryItem

export default emptyMeta
