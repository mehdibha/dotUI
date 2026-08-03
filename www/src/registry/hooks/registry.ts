import type { RegistryItem } from "@/registry/types"

export const registryHooks: RegistryItem[] = [
  {
    name: "use-image-loading-status",
    type: "registry:hook",
    files: [
      {
        type: "registry:hook",
        path: "hooks/use-image-loading-status.ts",
        target: "hooks/use-image-loading-status.ts",
      },
    ],
  },
  {
    name: "use-mobile",
    type: "registry:hook",
    files: [
      {
        type: "registry:hook",
        path: "hooks/use-mobile.ts",
        target: "hooks/use-mobile.ts",
      },
    ],
  },
]
