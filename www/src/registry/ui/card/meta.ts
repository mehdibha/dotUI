import type { RegistryItem } from "@/registry/types"

const cardMeta = {
  name: "card",
  type: "registry:ui",
  group: "containers",
  files: [
    {
      type: "registry:ui",
      path: "ui/card/base.tsx",
      target: "ui/card.tsx",
    },
  ],
  registryDependencies: ["focus-styles"],
  params: {
    style: {
      kind: "enum",
      default: "default",
      values: ["default", "tasnim"] as const,
    },
    titles: {
      kind: "enum",
      default: "quiet",
      values: ["quiet", "compact", "tight", "bold", "display", "caps"] as const,
      description: "The title recipe: size, weight, tracking and case.",
    },
  },
} satisfies RegistryItem

export default cardMeta
