import type { RegistryItem } from "@/registry/types"

const tableMeta = {
  name: "table",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/table/base.tsx",
      target: "ui/table.tsx",
    },
  ],
  registryDependencies: ["checkbox", "loader"],
  params: {
    separation: {
      default: "lines",
      values: ["lines", "striped", "plain"] as const,
      description: "How body rows are told apart.",
    },
    header: {
      default: "plain",
      values: ["plain", "filled"] as const,
    },
  },
} satisfies RegistryItem

export default tableMeta
