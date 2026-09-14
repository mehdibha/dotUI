import type { RegistryItem } from "@/registry/types"

const alertMeta = {
  name: "alert",
  type: "registry:ui",
  group: "feedback",
  files: [
    {
      type: "registry:ui",
      path: "ui/alert/base.tsx",
      target: "ui/alert.tsx",
    },
  ],
} satisfies RegistryItem

export default alertMeta
