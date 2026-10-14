import type { RegistryItem } from "@/registry/types"

const skeletonMeta = {
  name: "skeleton",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/skeleton/base.tsx",
      target: "ui/skeleton.tsx",
    },
  ],
  params: {
    animation: {
      default: "shimmer",
      values: ["shimmer", "pulse", "none"] as const,
    },
  },
} satisfies RegistryItem

export default skeletonMeta
