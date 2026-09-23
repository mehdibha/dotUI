import type { RegistryItem } from "@/registry/types"

const comboboxMeta = {
  name: "combobox",
  type: "registry:ui",
  group: "pickers",
  files: [
    {
      type: "registry:ui",
      path: "ui/combobox/base.tsx",
      target: "ui/combobox.tsx",
    },
  ],
  registryDependencies: ["field", "button", "input", "list-box", "popover"],
  params: {
    caret: {
      kind: "enum",
      default: "chevron",
      values: ["chevron", "double"] as const,
      source: { double: { ChevronDownIcon: "ChevronsUpDownIcon" } },
      description: "The trigger's caret glyph.",
    },
  },
} satisfies RegistryItem

export default comboboxMeta
