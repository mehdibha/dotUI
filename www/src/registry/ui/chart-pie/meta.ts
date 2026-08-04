import type { RegistryItem } from "@/registry/types"

const chartPieMeta = {
  name: "chart-pie",
  type: "registry:ui",
  group: "charts",
  files: [
    {
      type: "registry:ui",
      path: "ui/chart-pie/base.tsx",
      target: "ui/chart-pie.tsx",
    },
  ],
  dependencies: [
    "@tanstack/charts@0.0.2",
    "@tanstack/react-charts@0.0.2",
    "d3-scale",
    "d3-shape",
  ],
  devDependencies: ["@types/d3-scale", "@types/d3-shape"],
  registryDependencies: ["chart"],
} satisfies RegistryItem

export default chartPieMeta
