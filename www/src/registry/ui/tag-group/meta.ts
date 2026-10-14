import type { RegistryItem } from "@/registry/types"

const tagGroupMeta = {
  name: "tag-group",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/tag-group/base.tsx",
      target: "ui/tag-group.tsx",
    },
  ],
  registryDependencies: ["field", "button"],
  dependencies: ["react-aria-components"],
  params: {
    style: {
      default: "solid",
      values: ["solid", "soft", "outline", "soft-outline"] as const,
      description: "The chip fill a tag wears.",
    },
  },
} satisfies RegistryItem

export default tagGroupMeta
