import type { RegistryItem } from "@/registry/types"

const bubbleMeta = {
  name: "bubble",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/bubble/base.tsx",
      target: "ui/bubble.tsx",
    },
  ],
} satisfies RegistryItem

export default bubbleMeta
