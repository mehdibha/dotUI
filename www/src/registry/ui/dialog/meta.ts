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
    header: {
      kind: "enum",
      default: "title",
      values: ["title", "band"] as const,
      description:
        "How a popover titles itself: a plain title, or a tinted divided band.",
    },
  },
} satisfies RegistryItem

export default dialogMeta
