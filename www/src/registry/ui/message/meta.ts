import type { RegistryItem } from "@/registry/types"

const messageMeta = {
  name: "message",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/message/base.tsx",
      target: "ui/message.tsx",
    },
  ],
} satisfies RegistryItem

export default messageMeta
