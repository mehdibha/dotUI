import type { RegistryItem } from "@/registry/types"

const collapsibleMeta = {
  name: "collapsible",
  type: "registry:ui",
  group: "disclosure",
  files: [
    {
      type: "registry:ui",
      path: "ui/collapsible/base.tsx",
      target: "ui/collapsible.tsx",
    },
  ],
  // Synced with the accordion's motion.
  params: {
    motion: {
      kind: "enum",
      default: "expand",
      values: ["expand", "fade", "none"] as const,
      description:
        "How the panel opens and closes: its height alone, the height with a fade, or at once.",
    },
  },
} satisfies RegistryItem

export default collapsibleMeta
