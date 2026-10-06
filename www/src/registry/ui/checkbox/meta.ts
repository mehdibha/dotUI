import type { RegistryItem } from "@/registry/types"

const checkboxMeta = {
  name: "checkbox",
  type: "registry:ui",
  group: "selection-controls",
  files: [
    {
      type: "registry:ui",
      path: "ui/checkbox/base.tsx",
      target: "ui/checkbox.tsx",
    },
  ],
  registryDependencies: ["focus-styles", "field"],
  params: {
    "card-selected": {
      kind: "enum",
      default: "tint",
      values: ["tint", "outline-tint", "outline"] as const,
      description: "What marks the selected card.",
    },
  },
} satisfies RegistryItem

export default checkboxMeta
