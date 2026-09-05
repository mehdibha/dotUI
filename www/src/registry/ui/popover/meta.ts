import type { RegistryItem } from "@/registry/types"

const popoverMeta = {
  name: "popover",
  type: "registry:ui",
  group: "overlays",
  files: [
    {
      type: "registry:ui",
      path: "ui/popover/base.drawer.tsx",
      target: "ui/popover.tsx",
    },
  ],
  registryDependencies: ["drawer", "use-mobile"],
  // Synced with tooltip and modal: the studio's Motion axis writes all three.
  params: {
    motion: {
      kind: "enum",
      default: "scale",
      values: ["scale", "fade", "slide", "none"] as const,
      description: "How the surface enters and leaves.",
    },
    mobile: {
      kind: "enum",
      default: "drawer",
      values: ["drawer", "popover"] as const,
      files: {
        drawer: [
          {
            type: "registry:ui",
            path: "ui/popover/base.drawer.tsx",
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
        "What pickers and menus become below the mobile line: a bottom drawer, or the popover kept anchored.",
    },
  },
} satisfies RegistryItem

export default popoverMeta
