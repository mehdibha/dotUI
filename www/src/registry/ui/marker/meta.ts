import type { RegistryItem } from "@/registry/types"

const markerMeta = {
  name: "marker",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/marker/base.tsx",
      target: "ui/marker.tsx",
    },
  ],
} satisfies RegistryItem

export default markerMeta
