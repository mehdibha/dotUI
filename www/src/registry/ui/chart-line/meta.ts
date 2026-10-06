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
  dependencies: ["@tanstack/charts@1.0.0"],
  registryDependencies: ["chart"],
} satisfies RegistryItem

export default chartLineMeta
