import type { RegistryItem } from "@/registry/types"

const avatarMeta = {
  name: "avatar",
  type: "registry:ui",
  group: "containers",
  files: [
    {
      type: "registry:ui",
      path: "ui/avatar/base.tsx",
      target: "ui/avatar.tsx",
    },
  ],
  registryDependencies: ["context", "use-image-loading-status"],
} satisfies RegistryItem

export default avatarMeta
