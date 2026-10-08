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
    "card-press": {
      kind: "enum",
      default: "none",
      values: ["none", "sink"] as const,
      description: "Whether a pressed or disabled card sinks into its lip.",
    },
  },
} satisfies RegistryItem

export default switchMeta
