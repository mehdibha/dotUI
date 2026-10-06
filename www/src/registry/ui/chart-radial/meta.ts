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
  dependencies: ["@tanstack/charts@1.0.0"],
  registryDependencies: ["chart"],
} satisfies RegistryItem

export default chartRadialMeta
