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
    header: {
      kind: "enum",
      default: "none",
      values: ["none", "rule", "band"] as const,
      description: "What sets the header apart: nothing, a rule, or a band.",
    },
    footer: {
      kind: "enum",
      default: "none",
      values: ["none", "rule", "band"] as const,
      description: "What sets the footer apart: nothing, a rule, or a band.",
    },
    titles: {
      kind: "enum",
      default: "quiet",
      values: ["quiet", "compact", "tight", "bold", "display", "caps"] as const,
      description: "The title recipe: size, weight, tracking and case.",
    },
  },
} satisfies RegistryItem

export default cardMeta
