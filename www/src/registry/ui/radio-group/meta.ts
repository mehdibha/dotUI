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
  // Synced with checkbox and switch: the studio's Choice cards axes write
  // all three.
  params: {
    "card-selected": {
      kind: "enum",
      default: "outline",
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
