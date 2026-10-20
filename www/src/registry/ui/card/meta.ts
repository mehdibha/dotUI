import type { RegistryItem } from "@/registry/types"

const cardMeta = {
  name: "card",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/card/base.tsx",
      target: "ui/card.tsx",
    },
  ],
  params: {
    header: {
      default: "none",
      values: ["none", "rule", "band"] as const,
      description: "What sets the header apart: nothing, a rule, or a band.",
    },
    footer: {
      default: "none",
      values: ["none", "rule", "band"] as const,
      description: "What sets the footer apart: nothing, a rule, or a band.",
    },
    titles: {
      default: "quiet",
      values: ["quiet", "compact", "tight", "bold", "display", "caps"] as const,
      description: "The title recipe: size, weight, tracking and case.",
    },
  },
} satisfies RegistryItem

export default cardMeta
