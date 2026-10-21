import type { RegistryItem } from "@/registry/types"

const popoverMeta = {
  name: "popover",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/popover/base.drawer.tsx",
      target: "ui/popover.tsx",
    },
  ],
  // Menus, selects and pickers ride on the popover's motion.
  params: {
    motion: {
      default: "scale",
      values: ["scale", "fade", "slide", "none"] as const,
      description: "How the surface enters and leaves.",
    },
    mobile: {
      default: "drawer",
      values: ["drawer", "anchored"] as const,
      registryDependencies: { drawer: ["sheet", "use-mobile"] },
      files: {
        drawer: [
          {
            type: "registry:ui",
            path: "ui/popover/base.drawer.tsx",
            target: "ui/popover.tsx",
          },
        ],
        anchored: [
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
      default: "none",
      values: ["none", "tip"] as const,
      source: { tip: { "showArrow = false": "showArrow = true" } },
      description: "Whether the panel points at its trigger.",
    },
  },
} satisfies RegistryItem

export default popoverMeta
