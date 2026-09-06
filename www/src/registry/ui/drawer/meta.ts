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
    backdrop: {
      kind: "enum",
      default: "dim",
      values: ["dim", "blur", "none"] as const,
      description: "How the page reads under the open drawer.",
    },
  },
} satisfies RegistryItem

export default drawerMeta
