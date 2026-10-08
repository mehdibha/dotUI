import type { RegistryItem } from "@/registry/types"

const emptyMeta = {
  name: "empty",
  type: "registry:ui",
  group: "feedback",
  files: [
    {
      type: "registry:ui",
      path: "ui/empty/base.tsx",
      target: "ui/empty.tsx",
    },
  ],
  params: {
    titles: {
      kind: "enum",
      default: "quiet",
      values: ["quiet", "compact", "tight", "bold", "display", "caps"] as const,
      description: "The title recipe: size, weight, tracking and case.",
    },
  },
} satisfies RegistryItem

export default emptyMeta
