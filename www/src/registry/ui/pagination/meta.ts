import type { RegistryItem } from "@/registry/types"

const paginationMeta = {
  name: "pagination",
  type: "registry:ui",
  group: "navigation",
  files: [
    {
      type: "registry:ui",
      path: "ui/pagination/base.tsx",
      target: "ui/pagination.tsx",
    },
  ],
  registryDependencies: ["button"],
  params: {
    current: {
      kind: "enum",
      default: "outline",
      values: ["filled", "outline"] as const,
      description:
        "The current page's button variant: primary fill or the secondary outline.",
    },
  },
} satisfies RegistryItem

export default paginationMeta
