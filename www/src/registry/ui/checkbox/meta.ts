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
    "card-selected": {
      default: "tint",
      values: ["outline", "tint", "outline-tint"] as const,
      description: "What marks the selected card.",
    },
    "card-control": {
      default: "start",
      values: ["start", "end", "hidden"] as const,
      description: "Where the control sits in a card.",
    },
  },
} satisfies RegistryItem

export default checkboxMeta
