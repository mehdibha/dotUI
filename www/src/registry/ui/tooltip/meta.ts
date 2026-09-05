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
    style: {
      kind: "enum",
      default: "inverted",
      values: ["inverted", "surface"] as const,
      description:
        "The tooltip's surface: an inverted chip, or a bordered popover surface.",
    },
  },
} satisfies RegistryItem

export default tooltipMeta
