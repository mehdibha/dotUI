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
  params: {
    style: {
      kind: "enum",
      default: "inset",
      values: ["inset", "outlined", "slab"] as const,
      description: "The track and knob recipe.",
    },
    "card-selected": {
      kind: "enum",
      default: "tint",
      values: ["tint", "outline-tint", "outline"] as const,
      description: "What marks the selected card.",
    },
    "card-color": {
      kind: "enum",
      default: "control",
      values: ["control", "accent"] as const,
      description: "The selected card's ink: the control's own, or the accent.",
    },
  },
} satisfies RegistryItem

export default switchMeta
