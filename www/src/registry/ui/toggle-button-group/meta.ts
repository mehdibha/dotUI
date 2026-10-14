import type { RegistryItem } from "@/registry/types"

const toggleButtonGroupMeta = {
  name: "toggle-button-group",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/toggle-button-group/base.tsx",
      target: "ui/toggle-button-group.tsx",
    },
  ],
  registryDependencies: ["toggle-button"],
  // Synced with group: the studio's Buttons page writes both.
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

export default toggleButtonGroupMeta
