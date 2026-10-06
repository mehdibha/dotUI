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
    edge: {
      kind: "enum",
      default: "docked",
      values: ["docked", "detached"] as const,
      description:
        "How the sheet meets the screen: flush to its edge, or a card inset from it.",
    },
  },
} satisfies RegistryItem

export default drawerMeta
