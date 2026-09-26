import type { RegistryItem } from "@/registry/types"

const cardMeta = {
  name: "card",
  type: "registry:ui",
  group: "containers",
  files: [
    {
      type: "registry:ui",
      path: "ui/card/base.tsx",
      target: "ui/card.tsx",
    },
  ],
  registryDependencies: ["focus-styles"],
  params: {
    style: {
      kind: "enum",
      default: "default",
      values: ["default", "tasnim"] as const,
    },
  },
} satisfies RegistryItem

export default cardMeta
