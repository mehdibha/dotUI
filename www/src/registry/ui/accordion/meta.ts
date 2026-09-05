import type { RegistryItem } from "@/registry/types"

const accordionMeta = {
  name: "accordion",
  type: "registry:ui",
  group: "disclosure",
  files: [
    {
      type: "registry:ui",
      path: "ui/accordion/base.tsx",
      target: "ui/accordion.tsx",
    },
  ],
  params: {
    container: {
      kind: "enum",
      default: "divided",
      values: ["divided", "boxed", "cards"] as const,
      description:
        "How the items are grouped: hairline rows, one bordered surface, or a card each.",
    },
  },
} satisfies RegistryItem

export default accordionMeta
