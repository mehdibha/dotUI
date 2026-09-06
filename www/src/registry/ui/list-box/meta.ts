import type { RegistryItem } from "@/registry/types"

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
  params: {
    indicator: {
      kind: "enum",
      default: "check-end",
      values: ["check-start", "check-end"] as const,
      description: "Where the selected item's check sits.",
    },
    highlight: {
      kind: "enum",
      default: "neutral",
      values: ["neutral", "accent"] as const,
      vars: {
        neutral: {
          "--color-highlight": "var(--neutral-200)",
          "--color-fg-on-highlight": "var(--neutral-950)",
        },
        accent: {
          "--color-highlight": "var(--accent-700)",
          "--color-fg-on-highlight": "var(--on-accent-700)",
        },
      },
      description: "How focused/active items are highlighted.",
    },
    inset: {
      kind: "enum",
      default: "inset",
      values: ["inset", "full-bleed"] as const,
      description: "Rounded items in a padded gutter, or edge-to-edge rows.",
    },
    labels: {
      kind: "enum",
      default: "sentence",
      values: ["sentence", "caps"] as const,
      description: "Section header casing.",
    },
  },
} satisfies RegistryItem

export default listBoxMeta
