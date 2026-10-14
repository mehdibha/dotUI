import type { RegistryItem } from "@/registry/types"

/* The list-rows params; menu ships the same recipe (./styles LIST_ROWS). */
export const LIST_PARAMS = {
  indicator: {
    kind: "enum",
    default: "check-end",
    values: ["check-start", "check-end", "none"] as const,
    description: "Where the selected item's check sits, or no check.",
  },
  highlight: {
    kind: "enum",
    default: "neutral",
    values: ["neutral", "accent"] as const,
    description: "How hovered and focused items are highlighted.",
  },
  inset: {
    kind: "enum",
    default: "inset",
    values: ["inset", "full-bleed"] as const,
    description: "Rounded items in a padded gutter, or edge-to-edge rows.",
  },
  selected: {
    kind: "enum",
    default: "none",
    values: ["none", "tint"] as const,
    description: "Whether the selected item keeps a tinted row.",
  },
  rows: {
    kind: "enum",
    default: "auto",
    values: ["auto", "match", "step"] as const,
    description:
      "Item height: the density's own, the control height, or a step above.",
  },
  labels: {
    kind: "enum",
    default: "sentence",
    values: ["sentence", "caps", "mono-caps"] as const,
    description: "Section header casing and face.",
  },
} satisfies RegistryItem["params"]

const listBoxMeta = {
  name: "list-box",
  type: "registry:ui",
  group: "menus-lists",
  files: [
    {
      type: "registry:ui",
      path: "ui/list-box/base.tsx",
      target: "ui/list-box.tsx",
    },
  ],
  registryDependencies: ["text", "loader", "focus-styles"],
  dependencies: ["react-aria-components"],
  params: LIST_PARAMS,
} satisfies RegistryItem

export default listBoxMeta
