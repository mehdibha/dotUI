import type { RegistryItem } from "@/registry/types"

const popoverMeta = {
  name: "popover",
  type: "registry:ui",
  group: "overlays",
  files: [
    {
      type: "registry:ui",
      path: "ui/popover/base.tsx",
      target: "ui/popover.tsx",
    },
  ],
  // Synced with tooltip and modal: the studio's Motion axis writes all three.
  params: {
    motion: {
      kind: "enum",
      default: "scale",
      values: ["scale", "fade", "slide", "none"] as const,
      description: "How the surface enters and leaves.",
    },
  },
} satisfies RegistryItem

export default popoverMeta
