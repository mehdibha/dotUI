import type { RegistryItem } from "@/registry/types"

const inputMeta = {
  name: "input",
  type: "registry:ui",
  group: "inputs",
  files: [
    {
      type: "registry:ui",
      path: "ui/input/base.tsx",
      target: "ui/input.tsx",
    },
  ],
  registryDependencies: ["focus-styles"],
  dependencies: ["react-aria", "react-stately"],
  // Shared by every field: TextArea, SearchField, Combobox, DateField,
  // NumberField, OTP cells and the field-style select trigger render through
  // these slots.
  params: {
    style: {
      kind: "enum",
      default: "outline",
      values: [
        "outline",
        "raised",
        "inset",
        "well",
        "filled",
        "indicator",
        "underline",
      ] as const,
      description: "The field shell every input wears.",
    },
    hover: {
      kind: "enum",
      default: "none",
      values: ["none", "edge", "tint", "edge-tint"] as const,
    },
    height: {
      kind: "enum",
      default: "controls",
      values: ["controls", "step", "tall"] as const,
      description:
        "Field height against the control ladder: equal, one rung taller, or four.",
    },
    text: {
      kind: "enum",
      default: "same",
      values: ["same", "large"] as const,
      description: "Field value text: the control text, or one rung above it.",
    },
    errorIcon: {
      kind: "enum",
      default: "none",
      values: ["none", "inside"] as const,
      description: "A danger icon inside an invalid field.",
    },
  },
} satisfies RegistryItem

export default inputMeta
