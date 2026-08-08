import type { RegistryItem } from "@/registry/types"

const chartScatterMeta = {
  name: "chart-scatter",
  type: "registry:ui",
  group: "charts",
  files: [
    {
      type: "registry:ui",
      path: "ui/chart-scatter/base.tsx",
      target: "ui/chart-scatter.tsx",
    },
  ],
  dependencies: ["@tanstack/charts@0.7.2", "d3-scale"],
  devDependencies: ["@types/d3-scale"],
  registryDependencies: ["chart"],
} satisfies RegistryItem

export default chartScatterMeta
