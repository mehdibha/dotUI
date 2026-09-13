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
    marker: {
      kind: "enum",
      default: "chevron",
      values: ["chevron", "plus"] as const,
      description:
        "The glyph that shows a trigger opens: a turning chevron or a plus that becomes a minus.",
    },
    markerPosition: {
      kind: "enum",
      default: "trailing",
      values: ["trailing", "leading"] as const,
    },
  },
} satisfies RegistryItem

export default accordionMeta
