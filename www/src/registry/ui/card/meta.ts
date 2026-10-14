import type { RegistryItem } from "@/registry/types"

const cardMeta = {
  name: "card",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/card/base.tsx",
      target: "ui/card.tsx",
    },
  ],
  params: {
    style: {
      default: "default",
      values: ["default", "tasnim"] as const,
    },
  },
} satisfies RegistryItem

export default cardMeta
