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
  // Synced with tag-group: the studio's Badges axes write both.
  params: {
    style: {
      kind: "enum",
      default: "solid",
      values: ["solid", "soft", "outline", "soft-outline"] as const,
      description: "The appearance a badge wears when none is set.",
    },
  },
} satisfies RegistryItem

export default badgeMeta
