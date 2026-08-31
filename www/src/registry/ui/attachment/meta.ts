import type { RegistryItem } from "@/registry/types"

const attachmentMeta = {
  name: "attachment",
  type: "registry:ui",
  group: "containers",
  files: [
    {
      type: "registry:ui",
      path: "ui/attachment/base.tsx",
      target: "ui/attachment.tsx",
    },
  ],
  registryDependencies: ["button"],
} satisfies RegistryItem

export default attachmentMeta
