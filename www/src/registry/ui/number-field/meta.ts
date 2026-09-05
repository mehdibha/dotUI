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
  files: [...file("right")],
  registryDependencies: ["input", "field", "button"],
  params: {
    steppers: {
      kind: "enum",
      default: "right",
      values: ["right", "split", "stacked"] as const,
      description:
        "Where the stepper buttons sit: an attached pair on the right, one at each end, or a stacked chevron column.",
      files: {
        right: file("right"),
        split: file("split"),
        stacked: file("stacked"),
      },
    },
  },
} satisfies RegistryItem

export default numberFieldMeta
