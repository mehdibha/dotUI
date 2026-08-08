import type { RegistryItem } from "@/registry/types"

const chartRadarMeta = {
  name: "chart-radar",
  type: "registry:ui",
  group: "charts",
  files: [
    {
      type: "registry:ui",
      path: "ui/chart-radar/base.tsx",
      target: "ui/chart-radar.tsx",
    },
  ],
  dependencies: [
    "@tanstack/charts@0.7.2",
    "@tanstack/react-charts@0.7.2",
    "d3-scale",
    "d3-shape",
  ],
  devDependencies: ["@types/d3-scale", "@types/d3-shape"],
  registryDependencies: ["chart"],
} satisfies RegistryItem

export default chartRadarMeta
