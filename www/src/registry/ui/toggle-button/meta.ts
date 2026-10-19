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
  // Synced with button: the studio's Buttons page writes both.
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
    secondary: {
      default: "flat",
      values: [
        "flat",
        "hairline",
        "rim-light",
        "gloss",
        "bevel",
        "ledge",
        "outline",
        "raised",
        "soft",
        "tonal",
        "solid",
      ] as const,
    },
    press: {
      default: "as-style",
      values: ["as-style", "nudge", "scale"] as const,
    },
    case: {
      default: "sentence",
      values: ["sentence", "uppercase"] as const,
    },
    selected: {
      default: "tone",
      values: ["tone", "solid", "tint", "inverse"] as const,
    },
  },
} satisfies RegistryItem

export default toggleButtonMeta
