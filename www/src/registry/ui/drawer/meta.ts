import type { RegistryItem } from "@/registry/types"

const drawerMeta = {
  name: "drawer",
  type: "registry:ui",
  group: "overlays",
  files: [
    {
      type: "registry:ui",
      path: "ui/drawer/base.tsx",
      target: "ui/drawer.tsx",
    },
  ],
  params: {
    // Synced with modal: one Dialogs axis writes both backdrops.
    backdrop: {
      kind: "enum",
      default: "dim",
      values: ["dim", "blur", "none"] as const,
      description: "How the page reads under the open drawer.",
    },
  },
} satisfies RegistryItem

export default drawerMeta
