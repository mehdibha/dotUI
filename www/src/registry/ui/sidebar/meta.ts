import type { RegistryItem } from "@/registry/types"

const sidebarMeta = {
  name: "sidebar",
  type: "registry:ui",
  group: "navigation",
  files: [
    {
      type: "registry:ui",
      path: "ui/sidebar/base.tsx",
      target: "ui/sidebar.tsx",
    },
  ],
  registryDependencies: [
    "button",
    "context",
    "drawer",
    "separator",
    "skeleton",
    "tooltip",
    "use-mobile",
  ],
  params: {
    labels: {
      kind: "enum",
      default: "sentence",
      values: ["sentence", "caps"] as const,
      description: "Group label casing.",
    },
  },
} satisfies RegistryItem

export default sidebarMeta
