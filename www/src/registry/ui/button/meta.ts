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
  // Synced with toggle-button: the studio's Buttons page writes both.
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
      description:
        "A real system's button recipe: fills, edges, hover and press.",
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
      description: "The secondary button: a style's own, or one swapped in.",
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
    current: {
      kind: "enum",
      default: "none",
      values: ["none", "tone", "solid", "tint", "inverse"] as const,
      description: "The selected look a current pagination page wears.",
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

export default buttonMeta
