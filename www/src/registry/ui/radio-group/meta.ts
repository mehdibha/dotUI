import type { RegistryItem } from "@/registry/types"

const radioGroupMeta = {
  name: "radio-group",
  type: "registry:ui",
  group: "selection-controls",
  files: [
    {
      type: "registry:ui",
      path: "ui/radio-group/base.tsx",
      target: "ui/radio-group.tsx",
    },
  ],
  registryDependencies: ["focus-styles", "field"],
  params: {
    mark: {
      kind: "enum",
      default: "dot",
      values: ["dot", "ring"] as const,
      description: "The selected mark: a filled disc, or a ring around a dot.",
    },
    "card-selected": {
      kind: "enum",
      default: "tint",
      values: ["tint", "outline-tint", "outline"] as const,
      description: "What marks the selected card.",
    },
    "card-press": {
      kind: "enum",
      default: "none",
      values: ["none", "sink"] as const,
      description: "Whether a pressed or disabled card sinks into its lip.",
    },
  },
} satisfies RegistryItem

export default radioGroupMeta
