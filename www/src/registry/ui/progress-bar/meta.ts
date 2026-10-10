import type { RegistryItem } from "@/registry/types"

const progressBarMeta = {
  name: "progress-bar",
  type: "registry:ui",
  group: "progress",
  files: [
    {
      type: "registry:ui",
      path: "ui/progress-bar/base.tsx",
      target: "ui/progress-bar.tsx",
    },
  ],
  registryDependencies: ["field"],
  params: {
    track: {
      kind: "enum",
      default: "thin",
      values: ["thin", "medium", "thick", "x-heavy"] as const,
      description: "The bar's thickness.",
    },
    trackStyle: {
      kind: "enum",
      default: "plain",
      values: ["plain", "bordered", "gap"] as const,
      description: "How the track sits around the fill.",
    },
  },
} satisfies RegistryItem

export default progressBarMeta
