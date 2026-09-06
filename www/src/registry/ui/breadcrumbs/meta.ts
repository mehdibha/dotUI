import type { RegistryItem } from "@/registry/types"

const breadcrumbsMeta = {
  name: "breadcrumbs",
  type: "registry:ui",
  group: "navigation",
  files: [
    {
      type: "registry:ui",
      path: "ui/breadcrumbs/base.tsx",
      target: "ui/breadcrumbs.tsx",
    },
  ],
  registryDependencies: ["focus-styles"],
  params: {
    separator: {
      kind: "enum",
      default: "chevron",
      values: ["chevron", "slash"] as const,
    },
    tone: {
      kind: "enum",
      default: "muted",
      values: ["muted", "accent"] as const,
      description:
        "Ancestor crumbs: muted labels that sharpen on hover, or accent links.",
    },
  },
} satisfies RegistryItem

export default breadcrumbsMeta
