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
    mobile: {
      kind: "enum",
      default: "center",
      values: ["center", "sheet"] as const,
      description:
        "Where the modal sits below the mobile line: centered, or docked to the bottom edge as a sheet.",
    },
  },
} satisfies RegistryItem

export default modalMeta
