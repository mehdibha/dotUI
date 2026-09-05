import type { RegistryItem } from "@/registry/types"

const modalMeta = {
  name: "modal",
  type: "registry:ui",
  group: "overlays",
  files: [
    {
      type: "registry:ui",
      path: "ui/modal/base.tsx",
      target: "ui/modal.tsx",
    },
  ],
  params: {
    style: {
      kind: "enum",
      default: "default",
      values: ["default", "muted-footer"] as const,
    },
    // Synced with popover and tooltip: the studio's Motion axis writes all three.
    motion: {
      kind: "enum",
      default: "scale",
      values: ["scale", "fade", "slide", "none"] as const,
      description: "How the dialog enters and leaves.",
    },
  },
} satisfies RegistryItem

export default modalMeta
