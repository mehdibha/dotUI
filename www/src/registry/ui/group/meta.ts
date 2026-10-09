import type { RegistryItem } from "@/registry/types"

const groupMeta = {
  name: "group",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/group/base.tsx",
      target: "ui/group.tsx",
    },
  ],
  registryDependencies: ["button"],
  // Synced with toggle-button-group: the studio's Button groups axis writes both.
  params: {
    separator: {
      default: "auto",
      values: ["auto", "divider", "none"] as const,
    },
  },
} satisfies RegistryItem

export default groupMeta
