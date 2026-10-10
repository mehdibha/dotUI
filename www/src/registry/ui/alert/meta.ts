import type { RegistryItem } from "@/registry/types"

const alertMeta = {
  name: "alert",
  type: "registry:ui",
  group: "feedback",
  files: [
    {
      type: "registry:ui",
      path: "ui/alert/base.tsx",
      target: "ui/alert.tsx",
    },
  ],
  params: {
    style: {
      kind: "enum",
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
