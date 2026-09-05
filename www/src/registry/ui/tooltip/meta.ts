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
  },
} satisfies RegistryItem

export default tooltipMeta
