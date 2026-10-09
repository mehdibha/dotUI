import type { RegistryItem } from "@/registry/types"

const segmentedControlMeta = {
  name: "segmented-control",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/segmented-control/base.tsx",
      target: "ui/segmented-control.tsx",
    },
  ],
  params: {
    selected: {
      default: "flat",
      values: ["raised", "flat", "inverse"] as const,
    },
    track: {
      default: "filled",
      values: ["filled", "outline"] as const,
    },
  },
} satisfies RegistryItem

export default segmentedControlMeta
