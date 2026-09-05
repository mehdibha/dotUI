import type { RegistryItem } from "@/registry/types"

const fieldMeta = {
  name: "field",
  type: "registry:ui",
  group: "inputs",
  files: [
    {
      type: "registry:ui",
      path: "ui/field/base.tsx",
      target: "ui/field.tsx",
    },
  ],
  registryDependencies: ["text"],
  params: {
    error: {
      kind: "enum",
      default: "border",
      values: ["border", "message", "bar"] as const,
      description: "How a field shows a failed value.",
    },
  },
} satisfies RegistryItem

export default fieldMeta
