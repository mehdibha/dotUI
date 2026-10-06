import type { RegistryItem } from "@/registry/types"

const file = (layout: string) =>
  [
    {
      type: "registry:ui",
      path: `ui/number-field/base.${layout}.tsx`,
      target: "ui/number-field.tsx",
    },
  ] as const

const numberFieldMeta = {
  name: "number-field",
  type: "registry:ui",
  group: "inputs",
  files: [...file("right-cells")],
  registryDependencies: ["input", "field"],
  params: {
    steppers: {
      kind: "enum",
      default: "right-cells",
      values: [
        "right-cells",
        "stacked-cells",
        "stacked-inset",
        "split",
      ] as const,
      description:
        "Where the steppers sit in the field: cells at the end, a stacked column (divided or inset), or one at each end.",
      files: {
        "right-cells": file("right-cells"),
        "stacked-cells": file("stacked-cells"),
        "stacked-inset": file("stacked-inset"),
        split: file("split"),
      },
    },
  },
} satisfies RegistryItem

export default numberFieldMeta
