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
    highlight: {
      kind: "enum",
      default: "subtle",
      values: ["subtle", "accent"] as const,
      vars: {
        subtle: {
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
  },
} satisfies RegistryItem

export default listBoxMeta
