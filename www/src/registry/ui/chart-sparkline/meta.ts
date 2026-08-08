import type { RegistryItem } from "@/registry/types"

const chartSparklineMeta = {
  name: "chart-sparkline",
  type: "registry:ui",
  group: "charts",
  files: [
    {
      type: "registry:ui",
      path: "ui/chart-sparkline/base.tsx",
      target: "ui/chart-sparkline.tsx",
    },
  ],
  dependencies: ["@tanstack/charts@0.7.2", "d3-scale", "d3-shape"],
  devDependencies: ["@types/d3-scale", "@types/d3-shape"],
  registryDependencies: ["chart"],
} satisfies RegistryItem

export default chartSparklineMeta
