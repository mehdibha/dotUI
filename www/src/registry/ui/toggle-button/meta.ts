import type { RegistryItem } from "@/registry/types"

const toggleButtonMeta = {
  name: "toggle-button",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/toggle-button/base.tsx",
      target: "ui/toggle-button.tsx",
    },
  ],
  registryDependencies: ["context"],
  // Synced with button: the studio's Buttons style writes both.
  params: {
    style: {
      default: "flat",
      values: [
        "flat",
        "hairline",
        "rim-light",
        "gloss",
        "bevel",
        "ledge",
      ] as const,
    },
    selected: {
      default: "fill",
      values: ["fill", "chip", "inverse"] as const,
    },
  },
} satisfies RegistryItem

export default toggleButtonMeta
