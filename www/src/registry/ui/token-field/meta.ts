import type { RegistryItem } from "@/registry/types"

const tokenFieldMeta = {
  name: "token-field",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/token-field/base.tsx",
      target: "ui/token-field.tsx",
    },
  ],
  registryDependencies: ["field"],
} satisfies RegistryItem

export default tokenFieldMeta
