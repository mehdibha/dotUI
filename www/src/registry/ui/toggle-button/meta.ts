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
  // Synced with button: the studio's Buttons style writes both.
  params: {
    style: {
      kind: "enum",
      default: "flat",
      values: [
        "flat",
        "hairline",
        "rim-light",
        "gloss",
        "bevel",
        "offset",
        "ledge",
      ] as const,
    },
    selected: {
      kind: "enum",
      default: "fill",
      values: ["fill", "chip", "inverse"] as const,
    },
  },
} satisfies RegistryItem

export default toggleButtonMeta
