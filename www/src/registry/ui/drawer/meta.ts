import type { RegistryItem } from "@/registry/types"

const drawerMeta = {
  name: "drawer",
  type: "registry:ui",
  group: "overlays",
  dependencies: ["@base-ui/react"],
  files: [
    {
      type: "registry:ui",
      path: "ui/drawer/base.tsx",
      target: "ui/drawer.tsx",
    },
  ],
  params: {
    sheet: {
      kind: "enum",
      default: "attached",
      values: ["attached", "floating"] as const,
      description: "How a bottom sheet meets the screen edges.",
    },
    backdrop: {
      kind: "enum",
      default: "dim",
      values: ["dim", "blur", "none"] as const,
      description: "How the page reads under the open drawer.",
    },
  },
} satisfies RegistryItem

export default drawerMeta
