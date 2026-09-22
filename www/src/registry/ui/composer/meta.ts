import type { RegistryItem } from "@/registry/types"

const composerMeta = {
  name: "composer",
  type: "registry:ui",
  group: "containers",
  files: [
    {
      type: "registry:ui",
      path: "ui/composer/base.tsx",
      target: "ui/composer.tsx",
    },
  ],
  registryDependencies: ["button"],
  dependencies: ["react-aria-components"],
} satisfies RegistryItem

export default composerMeta
