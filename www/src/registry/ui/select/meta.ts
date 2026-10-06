import type { RegistryItem } from "@/registry/types"

const selectMeta = {
  name: "select",
  type: "registry:ui",
  group: "pickers",
  files: [
    {
      type: "registry:ui",
      path: "ui/select/base.tsx",
      target: "ui/select.tsx",
    },
  ],
  registryDependencies: ["field", "input", "list-box", "popover"],
  params: {
    trigger: {
      kind: "enum",
      default: "button",
      values: ["button", "field"] as const,
      registryDependencies: { button: ["button"] },
      files: {
        field: [
          {
            type: "registry:ui",
            path: "ui/select/base.field.tsx",
            target: "ui/select.tsx",
          },
        ],
      },
      description: "What draws the trigger: a button, or the field shell.",
    },
    caret: {
      kind: "enum",
      default: "chevron",
      values: ["chevron", "double"] as const,
      source: { double: { ChevronDownIcon: "ChevronsUpDownIcon" } },
      description: "The trigger's caret glyph.",
    },
  },
} satisfies RegistryItem

export default selectMeta
