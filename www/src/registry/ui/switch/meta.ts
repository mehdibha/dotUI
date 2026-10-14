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
    "card-selected": {
      default: "tint",
      values: ["outline", "tint", "outline-tint"] as const,
      description: "What marks the selected card.",
    },
  },
} satisfies RegistryItem

export default switchMeta
