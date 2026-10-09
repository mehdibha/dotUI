import type { RegistryItem } from "@/registry/types"

const chartRadialMeta = {
  name: "chart-radial",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/chart-radial/base.tsx",
      target: "ui/chart-radial.tsx",
    },
  ],
  dependencies: ["@tanstack/charts@0.18.0", "d3-scale"],
  devDependencies: ["@types/d3-scale"],
  registryDependencies: ["chart"],
} satisfies RegistryItem

export default chartRadialMeta
