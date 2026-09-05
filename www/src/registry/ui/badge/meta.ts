import type { RegistryItem } from "@/registry/types"

const badgeMeta = {
  name: "badge",
  type: "registry:ui",
  group: "tags",
  files: [
    {
      type: "registry:ui",
      path: "ui/badge/base.tsx",
      target: "ui/badge.tsx",
    },
  ],
} satisfies RegistryItem

export default badgeMeta
