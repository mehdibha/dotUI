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
  // Synced with toggle-button-group: the studio's Buttons page writes both.
  params: {
    segments: {
      default: "attached",
      values: ["attached", "gapped"] as const,
    },
    separator: {
      default: "shared-edge",
      values: ["shared-edge", "divider"] as const,
    },
  },
} satisfies RegistryItem

export default groupMeta
