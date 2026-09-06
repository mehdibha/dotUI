import type { RegistryItem } from "@/registry/types"

const groupMeta = {
  name: "group",
  type: "registry:ui",
  group: "containers",
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
      kind: "enum",
      default: "auto",
      values: ["auto", "divider", "none"] as const,
    },
  },
} satisfies RegistryItem

export default groupMeta
