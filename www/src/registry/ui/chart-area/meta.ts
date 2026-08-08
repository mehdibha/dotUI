import type { RegistryItem } from "@/registry/types"

const chartAreaMeta = {
  name: "chart-area",
  type: "registry:ui",
  group: "charts",
  files: [
    {
      type: "registry:ui",
      path: "ui/chart-area/base.tsx",
      target: "ui/chart-area.tsx",
    },
  ],
  dependencies: ["@tanstack/charts@0.0.2", "d3-shape"],
  devDependencies: ["@types/d3-shape"],
  registryDependencies: ["chart"],
} satisfies RegistryItem

export default chartAreaMeta
