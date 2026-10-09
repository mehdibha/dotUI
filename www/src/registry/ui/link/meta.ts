import type { RegistryItem } from "@/registry/types"

const linkMeta = {
  name: "link",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/link/base.tsx",
      target: "ui/link.tsx",
    },
  ],
  params: {
    underline: {
      default: "never",
      values: ["always", "hover", "never"] as const,
      description: "When a link wears its underline.",
    },
    color: {
      default: "accent",
      values: ["accent", "neutral"] as const,
      description:
        "The color the default link wears: the brand, or the text's own.",
    },
  },
} satisfies RegistryItem

export default linkMeta
