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
        "offset",
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
        "offset",
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
    linkUnderline: {
      default: "never",
      values: ["always", "hover", "never"] as const,
      description: "The link variant's underline, from the link recipe.",
    },
    linkColor: {
      default: "accent",
      values: ["accent", "neutral"] as const,
      description: "The link variant's color, from the link recipe.",
    },
  },
} satisfies RegistryItem

export default toggleButtonMeta
