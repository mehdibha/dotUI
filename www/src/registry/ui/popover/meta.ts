import type { RegistryItem } from "@/registry/types"

const popoverMeta = {
  name: "popover",
  type: "registry:ui",
  group: "overlays",
  files: [
    {
      type: "registry:ui",
      path: "ui/popover/base.sheet.tsx",
      target: "ui/popover.tsx",
    },
  ],
  // Menus, selects and pickers ride on the popover's motion.
  params: {
    motion: {
      kind: "enum",
      default: "scale",
      values: ["scale", "fade", "slide", "none"] as const,
      description: "How the surface enters and leaves.",
    },
    mobile: {
      kind: "enum",
      default: "sheet",
      values: ["sheet", "popover"] as const,
      registryDependencies: { sheet: ["sheet", "use-mobile"] },
      files: {
        sheet: [
          {
            type: "registry:ui",
            path: "ui/popover/base.sheet.tsx",
            target: "ui/popover.tsx",
          },
        ],
        popover: [
          {
            type: "registry:ui",
            path: "ui/popover/base.popover.tsx",
            target: "ui/popover.tsx",
          },
        ],
      },
      description:
        "What pickers and menus become below the mobile line: a bottom sheet, or the popover kept anchored.",
    },
    tip: {
      kind: "enum",
      default: "none",
      values: ["none", "tip"] as const,
      description: "Whether the panel points at its trigger.",
    },
  },
} satisfies RegistryItem

export default popoverMeta
