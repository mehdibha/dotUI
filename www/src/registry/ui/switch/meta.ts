import type { RegistryItem } from "@/registry/types"

const switchMeta = {
  name: "switch",
  type: "registry:ui",
  group: "selection-controls",
  files: [
    {
      type: "registry:ui",
      path: "ui/switch/base.tsx",
      target: "ui/switch.tsx",
    },
  ],
  registryDependencies: ["focus-styles", "field"],
  // Synced with checkbox and radio-group: the studio's Choice cards axes
  // write all three.
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

export default switchMeta
