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
    "card-selected": {
      kind: "enum",
      default: "tint",
      values: ["outline", "tint", "outline-tint"] as const,
      description: "What marks the selected card.",
    },
    "card-control": {
      kind: "enum",
      default: "start",
      values: ["start", "end", "hidden"] as const,
      description: "Where the control sits in a card.",
    },
  },
} satisfies RegistryItem

export default radioGroupMeta
