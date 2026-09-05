import type { RegistryItem } from "@/registry/types"

const tooltipMeta = {
  name: "tooltip",
  type: "registry:ui",
  group: "overlays",
  files: [
    {
      type: "registry:ui",
      path: "ui/tooltip/base.tsx",
      target: "ui/tooltip.tsx",
    },
  ],
  params: {
    color: {
      kind: "enum",
      default: "default",
      values: ["default", "translucid"] as const,
      vars: {
        translucid: {
          "--color-tooltip": "var(--neutral-200)",
          "--color-fg-on-tooltip": "var(--neutral-950)",
        },
      },
      description: "How the tooltip surface is rendered.",
    },
    // Synced with popover and modal: the studio's Motion axis writes all three.
    motion: {
      kind: "enum",
      default: "scale",
      values: ["scale", "fade", "slide", "none"] as const,
      description: "How the tooltip enters and leaves.",
    },
  },
} satisfies RegistryItem

export default tooltipMeta
