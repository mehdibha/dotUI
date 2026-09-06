import type { RegistryItem } from "@/registry/types"

const segmentedControlMeta = {
  name: "segmented-control",
  type: "registry:ui",
  group: "buttons",
  files: [
    {
      type: "registry:ui",
      path: "ui/segmented-control/base.tsx",
      target: "ui/segmented-control.tsx",
    },
  ],
  registryDependencies: ["focus-styles"],
  params: {
    selected: {
      kind: "enum",
      default: "flat",
      values: ["raised", "flat", "inverse"] as const,
    },
    track: {
      kind: "enum",
      default: "filled",
      values: ["filled", "outline"] as const,
    },
  },
} satisfies RegistryItem

export default segmentedControlMeta
