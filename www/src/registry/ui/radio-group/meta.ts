import type { RegistryItem } from "@/registry/types"

const radioGroupMeta = {
  name: "radio-group",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/radio-group/base.tsx",
      target: "ui/radio-group.tsx",
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

export default radioGroupMeta
