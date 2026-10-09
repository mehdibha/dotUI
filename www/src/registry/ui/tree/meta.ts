import type { RegistryItem } from "@/registry/types"

const treeMeta = {
  name: "tree",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/tree/base.tsx",
      target: "ui/tree.tsx",
    },
  ],
  registryDependencies: ["checkbox"],
  dependencies: ["react-aria-components"],
} satisfies RegistryItem

export default treeMeta
