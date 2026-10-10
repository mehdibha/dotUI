import type { RegistryItem } from "@/registry/types"

const avatarMeta = {
  name: "avatar",
  type: "registry:ui",
  group: "containers",
  files: [
    {
      type: "registry:ui",
      path: "ui/avatar/base.tsx",
      target: "ui/avatar.tsx",
    },
  ],
  registryDependencies: ["context", "use-image-loading-status"],
  params: {
    shape: {
      kind: "enum",
      default: "circle",
      values: ["circle", "rounded"] as const,
      description: "A circle, or a rounded square on the corner rungs.",
    },
    fallback: {
      kind: "enum",
      default: "neutral",
      values: ["neutral", "accent"] as const,
      description: "What initials sit on when no image loads.",
    },
  },
} satisfies RegistryItem

export default avatarMeta
