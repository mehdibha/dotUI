import type { RegistryItem } from "@/registry/types"

const toggleButtonGroupMeta = {
  name: "toggle-button-group",
  type: "registry:ui",
  group: "buttons",
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
      kind: "enum",
      default: "attached",
      values: ["attached", "gapped"] as const,
    },
    separator: {
      kind: "enum",
      default: "shared-edge",
      values: ["shared-edge", "divider"] as const,
    },
  },
} satisfies RegistryItem

export default toggleButtonGroupMeta
