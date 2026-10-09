import type { RegistryItem } from "@/registry/types"

const badgeMeta = {
  name: "badge",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/badge/base.tsx",
      target: "ui/badge.tsx",
    },
  ],
  params: {
    style: {
      default: "solid",
      values: ["solid", "soft", "outline", "soft-outline"] as const,
      description: "The appearance a badge wears when none is set.",
    },
  },
} satisfies RegistryItem

export default badgeMeta
