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
  },
} satisfies RegistryItem

export default modalMeta
