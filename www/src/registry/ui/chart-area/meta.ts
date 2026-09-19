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
  dependencies: ["@tanstack/charts@0.18.0"],
  registryDependencies: ["chart"],
} satisfies RegistryItem

export default chartAreaMeta
