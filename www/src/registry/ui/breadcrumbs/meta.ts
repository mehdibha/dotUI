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
    ancestors: {
      kind: "enum",
      default: "muted",
      values: [
        "muted",
        "accent-always",
        "accent-hover",
        "accent-never",
        "neutral-always",
        "neutral-hover",
        "neutral-never",
      ] as const,
      description:
        "Ancestor crumbs: muted labels that sharpen on hover, or links in the link color and underline.",
    },
  },
} satisfies RegistryItem

export default breadcrumbsMeta
