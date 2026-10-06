import type { RegistryItem } from "@/registry/types"

const dialogMeta = {
  name: "dialog",
  type: "registry:ui",
  group: "overlays",
  files: [
    {
      type: "registry:ui",
      path: "ui/dialog/base.tsx",
      target: "ui/dialog.tsx",
    },
  ],
  registryDependencies: ["responsive", "modal", "drawer", "popover", "button"],
  params: {
    titles: {
      kind: "enum",
      default: "quiet",
      values: ["quiet", "compact", "tight", "bold", "display", "caps"] as const,
      description: "The title recipe: size, weight, tracking and case.",
    },
  },
} satisfies RegistryItem

export default dialogMeta
