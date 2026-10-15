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
      values: ["expand", "none"] as const,
      description: "How a panel opens and closes: its height, or at once.",
    },
    layout: {
      default: "divided",
      values: ["divided", "contained", "separated", "plain"] as const,
      description:
        "How the items are grouped: hairline rows, one container, a container each, or nothing.",
    },
    marker: {
      default: "trailing-chevron",
      values: ["trailing-chevron", "leading-caret"] as const,
      description:
        "What shows a trigger opens: a trailing chevron that flips, or a leading caret that turns.",
    },
  },
} satisfies RegistryItem

export default accordionMeta
