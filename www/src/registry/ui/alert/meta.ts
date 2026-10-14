import type { RegistryItem } from "@/registry/types"

const alertMeta = {
  name: "alert",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/alert/base.tsx",
      target: "ui/alert.tsx",
    },
  ],
  params: {
    style: {
      default: "neutral",
      values: [
        "neutral",
        "soft",
        "soft-outline",
        "outline",
        "inverse",
      ] as const,
      description: "The alert's fill, edge and status ink.",
    },
  },
} satisfies RegistryItem

export default alertMeta
