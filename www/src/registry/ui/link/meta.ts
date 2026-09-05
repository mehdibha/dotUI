import type { RegistryItem } from "@/registry/types"

const linkMeta = {
  name: "link",
  type: "registry:ui",
  group: "buttons",
  files: [
    {
      type: "registry:ui",
      path: "ui/link/base.tsx",
      target: "ui/link.tsx",
    },
  ],
  registryDependencies: ["focus-styles"],
  params: {
    underline: {
      kind: "enum",
      default: "never",
      values: ["always", "hover", "never"] as const,
      description: "When a link wears its underline.",
    },
    color: {
      kind: "enum",
      default: "accent",
      values: ["accent", "foreground"] as const,
      description: "The color the default link wears.",
    },
  },
} satisfies RegistryItem

export default linkMeta
