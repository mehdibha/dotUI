import type { RegistryItem } from "@/registry/types"

const sidebarMeta = {
  name: "sidebar",
  type: "registry:ui",
  group: "navigation",
  files: [
    {
      type: "registry:ui",
      path: "ui/sidebar/base.tsx",
      target: "ui/sidebar.tsx",
    },
  ],
  registryDependencies: [
    "button",
    "context",
    "drawer",
    "separator",
    "skeleton",
    "tooltip",
    "use-mobile",
  ],
  params: {
    labels: {
      kind: "enum",
      default: "sentence",
      values: ["sentence", "caps", "mono-caps"] as const,
      description: "Group label casing and face.",
    },
    shell: {
      kind: "enum",
      default: "subtle",
      values: ["subtle", "page", "recessed"] as const,
      description: "The sidebar and frame tone around an inset panel.",
    },
    marker: {
      kind: "enum",
      default: "fill",
      values: [
        "fill",
        "fill-accent",
        "surface",
        "bar",
        "bar-accent",
        "fill-bar",
        "fill-bar-accent",
        "ink",
        "ink-accent",
        "outline",
        "outline-accent",
        "pill",
        "pill-accent",
      ] as const,
      description: "The current item's marker, in the indicator color.",
      vars: {
        pill: { "--studio-sidebar-button-radius": "var(--radius-full)" },
        "pill-accent": {
          "--studio-sidebar-button-radius": "var(--radius-full)",
        },
      },
    },
    weight: {
      kind: "enum",
      default: "regular-medium",
      values: [
        "regular",
        "regular-medium",
        "regular-semibold",
        "medium",
        "medium-semibold",
        "semibold",
        "bold",
      ] as const,
      description: "Item weight at rest, then current.",
    },
    case: {
      kind: "enum",
      default: "sentence",
      values: ["sentence", "uppercase"] as const,
      description: "Item label case.",
    },
  },
} satisfies RegistryItem

export default sidebarMeta
