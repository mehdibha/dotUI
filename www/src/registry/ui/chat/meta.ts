import type { RegistryItem } from "@/registry/types"

const chatMeta = {
  name: "chat",
  type: "registry:ui",
  group: "containers",
  files: [
    {
      type: "registry:ui",
      path: "ui/chat/base.tsx",
      target: "ui/chat.tsx",
    },
  ],
  registryDependencies: ["avatar", "button", "input"],
} satisfies RegistryItem

export default chatMeta
