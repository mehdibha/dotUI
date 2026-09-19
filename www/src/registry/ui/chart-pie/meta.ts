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
  dependencies: ["@tanstack/charts@0.18.0", "d3-scale"],
  devDependencies: ["@types/d3-scale"],
  registryDependencies: ["chart"],
} satisfies RegistryItem

export default chartPieMeta
