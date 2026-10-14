import type { RegistryItem } from "@/registry/types"

const avatarMeta = {
  name: "avatar",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/avatar/base.tsx",
      target: "ui/avatar.tsx",
    },
  ],
  registryDependencies: ["context", "use-image-loading-status"],
  params: {
    fallback: {
      default: "neutral",
      values: ["neutral", "tinted"] as const,
      description: "What initials sit on when no image loads.",
    },
  },
} satisfies RegistryItem

export default avatarMeta
