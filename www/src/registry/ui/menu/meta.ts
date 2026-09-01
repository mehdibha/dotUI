import type { RegistryItem } from "@/registry/types"

const menuMeta = {
  name: "menu",
  type: "registry:ui",
  group: "menus-lists",
  files: [
    {
      type: "registry:ui",
      path: "ui/menu/base.tsx",
      target: "ui/menu.tsx",
    },
  ],
  registryDependencies: [
    "kbd",
    "responsive",
    "modal",
    "drawer",
    "popover",
    "text",
  ],
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

export default menuMeta
