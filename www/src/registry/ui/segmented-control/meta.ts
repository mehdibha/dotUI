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
      default: "tone",
      values: ["tone", "raised", "ring", "inverse"] as const,
    },
    track: {
      kind: "enum",
      default: "filled",
      values: ["filled", "outline"] as const,
    },
    weight: {
      kind: "enum",
      default: "medium",
      values: [
        "regular",
        "regular-medium",
        "regular-semibold",
        "medium",
        "medium-semibold",
        "semibold",
        "bold",
      ] as const,
      description: "Item weight at rest, then selected.",
    },
    case: {
      kind: "enum",
      default: "sentence",
      values: ["sentence", "uppercase"] as const,
      description: "Item label case.",
    },
  },
} satisfies RegistryItem

export default segmentedControlMeta
