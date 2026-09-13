import type { RegistryItem } from "@/registry/types"

const collapsibleMeta = {
  name: "collapsible",
  type: "registry:ui",
  group: "disclosure",
  files: [
    {
      type: "registry:ui",
      path: "ui/collapsible/base.tsx",
      target: "ui/collapsible.tsx",
    },
  ],
} satisfies RegistryItem

export default collapsibleMeta
