import type { RegistryItem } from "@/registry/types"

const toggleButtonMeta = {
  name: "toggle-button",
  type: "registry:ui",
  group: "buttons",
  files: [
    {
      type: "registry:ui",
      path: "ui/toggle-button/base.tsx",
      target: "ui/toggle-button.tsx",
    },
  ],
  registryDependencies: ["context", "focus-styles"],
  // Synced with button: the studio's Buttons axes write both.
  params: {
    style: {
      kind: "enum",
      default: "flat",
      values: ["flat", "outline", "raised", "elevated"] as const,
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

export default toggleButtonMeta
