import type { RegistryItem } from "@/registry/types"

const accordionMeta = {
  name: "accordion",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/accordion/base.tsx",
      target: "ui/accordion.tsx",
    },
  ],
  // The collapsible rides on the accordion's motion.
  params: {
    motion: {
      default: "expand",
      values: ["expand", "fade", "none"] as const,
      description:
        "How a panel opens and closes: its height alone, the height with a fade, or at once.",
    },
    container: {
      default: "divided",
      values: ["divided", "boxed", "cards"] as const,
      description:
        "How the items are grouped: hairline rows, one bordered surface, or a card each.",
    },
    marker: {
      default: "chevron",
      values: ["chevron", "plus"] as const,
      description:
        "The glyph that shows a trigger opens: a turning chevron or a plus that becomes a minus.",
    },
    markerPosition: {
      default: "trailing",
      values: ["trailing", "leading"] as const,
    },
  },
} satisfies RegistryItem

export default accordionMeta
