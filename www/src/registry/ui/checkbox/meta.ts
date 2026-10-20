import type { RegistryItem } from "@/registry/types"

const checkboxMeta = {
  name: "checkbox",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/checkbox/base.tsx",
      target: "ui/checkbox.tsx",
    },
  ],
  registryDependencies: ["field"],
  params: {
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

export default checkboxMeta
