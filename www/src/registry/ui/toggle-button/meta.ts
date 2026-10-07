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
  // Synced with button: the studio's Buttons page writes both.
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
        "ledge",
      ] as const,
    },
    secondary: {
      kind: "enum",
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
      kind: "enum",
      default: "as-style",
      values: ["as-style", "nudge", "scale"] as const,
    },
    case: {
      kind: "enum",
      default: "sentence",
      values: ["sentence", "uppercase"] as const,
    },
    selected: {
      kind: "enum",
      default: "tone",
      values: ["tone", "solid", "tint", "inverse"] as const,
    },
    linkUnderline: {
      kind: "enum",
      default: "never",
      values: ["always", "hover", "never"] as const,
      description: "The link variant's underline, from the link recipe.",
    },
    linkColor: {
      kind: "enum",
      default: "accent",
      values: ["accent", "neutral"] as const,
      description: "The link variant's color, from the link recipe.",
    },
  },
} satisfies RegistryItem

export default toggleButtonMeta
