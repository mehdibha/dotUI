import type { RegistryItem } from "@/registry/types"

const chartRadialMeta = {
  name: "chart-radial",
  type: "registry:ui",
  group: "charts",
  files: [
    {
      type: "registry:ui",
      path: "ui/chart-radial/base.tsx",
      target: "ui/chart-radial.tsx",
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

export default chartRadialMeta
