import type { RegistryItem } from "@/registry/types"

const tableMeta = {
  name: "table",
  type: "registry:ui",
  group: "containers",
  files: [
    {
      type: "registry:ui",
      path: "ui/table/base.tsx",
      target: "ui/table.tsx",
    },
  ],
  registryDependencies: ["checkbox", "focus-styles", "loader"],
  params: {
    separation: {
      kind: "enum",
      default: "lines",
      values: ["lines", "striped", "plain"] as const,
      description: "How body rows are told apart.",
    },
    header: {
      kind: "enum",
      default: "plain",
      values: ["plain", "filled"] as const,
    },
  },
} satisfies RegistryItem

export default tableMeta
