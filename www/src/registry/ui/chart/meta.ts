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
  dependencies: ["@tanstack/charts@1.0.0", "d3-scale", "d3-shape"],
  devDependencies: ["@types/d3-scale", "@types/d3-shape"],
} satisfies RegistryItem

export default chartMeta
