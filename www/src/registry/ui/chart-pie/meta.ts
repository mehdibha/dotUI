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
  dependencies: ["@tanstack/charts@1.0.0"],
  registryDependencies: ["chart"],
} satisfies RegistryItem

export default chartPieMeta
