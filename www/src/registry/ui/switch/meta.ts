import type { RegistryItem } from "@/registry/types"

const switchMeta = {
  name: "switch",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/switch/base.tsx",
      target: "ui/switch.tsx",
    },
  ],
  registryDependencies: ["field"],
  params: {
    style: {
      default: "inset",
      values: ["inset", "outlined", "slab"] as const,
      description: "The track and knob recipe.",
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
  },
} satisfies RegistryItem

export default switchMeta
