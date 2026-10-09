import type { RegistryItem } from "@/registry/types"

const inputMeta = {
  name: "input",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/input/base.tsx",
      target: "ui/input.tsx",
    },
  ],
  dependencies: ["react-aria", "react-stately"],
  // Shared by every field: TextArea, SearchField, Combobox, DateField and
  // NumberField all render through Input / InputGroup.
  params: {
    style: {
      default: "outline",
      values: ["outline", "line", "filled-line-bottom", "filled"] as const,
      description: "The field shell every input wears.",
    },
    hover: {
      default: "none",
      values: ["none", "border", "tint"] as const,
    },
    addon: {
      default: "inside",
      values: ["inside", "boxed", "boxed-flush"] as const,
      description:
        "How an InputGroupAddon sits: floating inside the shell, or a tinted cell at the edge (divided by a hairline, or flush).",
    },
  },
} satisfies RegistryItem

export default inputMeta
