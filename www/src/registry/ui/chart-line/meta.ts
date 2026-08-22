import type { RegistryItem } from "@/registry/types"

const chartLineMeta = {
  name: "chart-line",
  type: "registry:ui",
  group: "charts",
  files: [
    {
      type: "registry:ui",
      path: "ui/chart-line/base.tsx",
      target: "ui/chart-line.tsx",
    },
  ],
  dependencies: ["@tanstack/charts@0.14.0", "d3-shape"],
  devDependencies: ["@types/d3-shape"],
  registryDependencies: ["chart"],
} satisfies RegistryItem

export default chartLineMeta
