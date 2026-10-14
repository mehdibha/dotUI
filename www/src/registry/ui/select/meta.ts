import type { RegistryItem } from "@/registry/types"

const selectMeta = {
  name: "select",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/select/base.tsx",
      target: "ui/select.tsx",
    },
  ],
  registryDependencies: ["button", "field", "list-box", "popover"],
  params: {
    caret: {
      default: "chevron",
      values: ["chevron", "double"] as const,
      source: { double: { ChevronDownIcon: "ChevronsUpDownIcon" } },
      description: "The trigger's caret glyph.",
    },
  },
} satisfies RegistryItem

export default selectMeta
