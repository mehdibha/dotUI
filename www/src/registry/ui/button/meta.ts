import type { RegistryItem } from "@/registry/types"

const buttonMeta = {
  name: "button",
  type: "registry:ui",
  group: "buttons",
  files: [
    {
      type: "registry:ui",
      path: "ui/button/base.tsx",
      target: "ui/button.tsx",
    },
  ],
  registryDependencies: ["loader", "focus-styles"],
  // Synced with toggle-button: the studio's Buttons axes write both.
  params: {
    style: {
      kind: "enum",
      default: "flat",
      values: ["flat", "outline", "raised", "elevated"] as const,
      description: "The family look every fill variant wears.",
    },
    hover: {
      kind: "enum",
      default: "dim",
      values: ["dim", "lighten", "none"] as const,
    },
    press: {
      kind: "enum",
      default: "dim",
      values: ["dim", "scale", "push", "none"] as const,
    },
  },
} satisfies RegistryItem

export default buttonMeta
