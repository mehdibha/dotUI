import type { RegistryItem } from "@/registry/types"

const tagGroupMeta = {
  name: "tag-group",
  type: "registry:ui",
  group: "tags",
  files: [
    {
      type: "registry:ui",
      path: "ui/tag-group/base.tsx",
      target: "ui/tag-group.tsx",
    },
  ],
  registryDependencies: ["field", "button", "focus-styles"],
  dependencies: ["react-aria-components"],
  params: {
    style: {
      kind: "enum",
      default: "solid",
      values: ["solid", "soft", "outline", "soft-outline"] as const,
      description: "The chip fill a tag wears.",
    },
  },
} satisfies RegistryItem

export default tagGroupMeta
