import type { RegistryItem } from "@/registry/types"

const loaderMeta = {
  name: "loader",
  type: "registry:ui",
  group: "progress",
  files: [
    {
      type: "registry:ui",
      path: "ui/loader/base.ring.tsx",
      target: "ui/loader.tsx",
    },
  ],
  params: {
    style: {
      kind: "enum",
      default: "ring",
      values: ["ring", "ring-track", "blades", "dots"] as const,
      files: {
        ring: [
          {
            type: "registry:ui",
            path: "ui/loader/base.ring.tsx",
            target: "ui/loader.tsx",
          },
        ],
        "ring-track": [
          {
            type: "registry:ui",
            path: "ui/loader/base.ring-track.tsx",
            target: "ui/loader.tsx",
          },
        ],
        blades: [
          {
            type: "registry:ui",
            path: "ui/loader/base.blades.tsx",
            target: "ui/loader.tsx",
          },
        ],
        dots: [
          {
            type: "registry:ui",
            path: "ui/loader/base.dots.tsx",
            target: "ui/loader.tsx",
          },
        ],
      },
    },
  },
} satisfies RegistryItem

export default loaderMeta
