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
} satisfies RegistryItem

export default tagGroupMeta
