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
  params: {
    tip: {
      kind: "enum",
      default: "none",
      values: ["none", "tip"] as const,
      description: "Whether the panel points at its trigger.",
      files: {
        none: [
          {
            type: "registry:ui",
            path: "ui/popover/base.tsx",
            target: "ui/popover.tsx",
          },
        ],
        tip: [
          {
            type: "registry:ui",
            path: "ui/popover/base.tip.tsx",
            target: "ui/popover.tsx",
          },
        ],
      },
    },
  },
} satisfies RegistryItem

export default popoverMeta
