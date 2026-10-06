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
      default: "secondary",
      values: ["secondary", "primary", "selected"] as const,
      description:
        "The current page's button: secondary, primary, or a quiet button in the selected look.",
    },
  },
} satisfies RegistryItem

export default paginationMeta
