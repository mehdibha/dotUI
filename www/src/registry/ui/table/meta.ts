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
    header: {
      default: "plain",
      values: ["plain", "filled"] as const,
      description: "The header row: a rule under the labels, or a band.",
    },
    headerLabel: {
      default: "muted",
      values: ["strong", "muted"] as const,
      description: "The header labels' ink.",
    },
  },
} satisfies RegistryItem

export default tableMeta
