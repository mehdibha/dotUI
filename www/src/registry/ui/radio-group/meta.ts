import type { RegistryItem } from "@/registry/types"

const radioGroupMeta = {
  name: "radio-group",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/radio-group/base.tsx",
      target: "ui/radio-group.tsx",
    },
  ],
  registryDependencies: ["field"],
  params: {
    mark: {
      default: "dot",
      values: ["dot", "ring"] as const,
      description: "The selected mark: a filled disc, or a ring around a dot.",
    },
    cardSelected: {
      default: "tint",
      values: ["tint", "outline-tint", "outline"] as const,
      description: "What marks the selected card.",
    },
    cardPress: {
      default: "none",
      values: ["none", "sink"] as const,
      description: "Whether a pressed or disabled card sinks into its lip.",
    },
    cardEdge: {
      default: "surface",
      values: ["surface", "control"] as const,
      description: "Whether the card's edge is a surface's or a control's.",
    },
  },
} satisfies RegistryItem

export default radioGroupMeta
