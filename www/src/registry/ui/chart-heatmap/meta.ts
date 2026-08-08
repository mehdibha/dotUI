import type { RegistryItem } from "@/registry/types"

const chartHeatmapMeta = {
  name: "chart-heatmap",
  type: "registry:ui",
  group: "charts",
  files: [
    {
      type: "registry:ui",
      path: "ui/chart-heatmap/base.tsx",
      target: "ui/chart-heatmap.tsx",
    },
  ],
  dependencies: ["@tanstack/charts@0.0.2", "d3-scale"],
  devDependencies: ["@types/d3-scale"],
  registryDependencies: ["chart"],
} satisfies RegistryItem

export default chartHeatmapMeta
