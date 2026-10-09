import type { RegistryItem } from "@/registry/types"

const breadcrumbsMeta = {
  name: "breadcrumbs",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/breadcrumbs/base.tsx",
      target: "ui/breadcrumbs.tsx",
    },
  ],
  params: {
    separator: {
      default: "chevron",
      values: ["chevron", "slash"] as const,
    },
    tone: {
      default: "muted",
      values: ["muted", "accent"] as const,
      description:
        "Ancestor crumbs: muted labels that sharpen on hover, or accent links.",
    },
  },
} satisfies RegistryItem

export default breadcrumbsMeta
