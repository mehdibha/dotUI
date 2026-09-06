import type { RegistryItem } from "@/registry/types"

const chartMeta = {
  name: "chart",
  type: "registry:ui",
  group: "charts",
  files: [
    {
      type: "registry:ui",
      path: "ui/chart/base.tsx",
      target: "ui/chart.tsx",
    },
  ],
  dependencies: ["@tanstack/charts@0.16.0", "d3-scale"],
  devDependencies: ["@types/d3-scale"],
  params: {
    grid: {
      kind: "enum",
      default: "solid",
      values: ["solid", "dashed", "none"] as const,
      description: "The gridline treatment behind the plot.",
    },
  },
} satisfies RegistryItem

export default chartMeta
