import type { RegistryItem } from "@/registry/types"

const buttonMeta = {
  name: "button",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/button/base.tsx",
      target: "ui/button.tsx",
    },
  ],
  registryDependencies: ["loader"],
  // Synced with toggle-button: the studio's Buttons page writes both.
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
      description:
        "A real system's button recipe: fills, edges, hover and press.",
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
      description: "The secondary button: a style's own, or one swapped in.",
    },
    danger: {
      default: "flat",
      values: [
        "flat",
        "hairline",
        "rim-light",
        "gloss",
        "bevel",
        "ledge",
        "tint",
        "outline",
      ] as const,
      description:
        "Warning and danger buttons: a style's own fill, a tint or an outline.",
    },
    press: {
      default: "as-style",
      values: ["as-style", "nudge", "scale"] as const,
    },
    case: {
      default: "sentence",
      values: ["sentence", "uppercase"] as const,
    },
    current: {
      default: "none",
      values: ["none", "tone", "solid", "tint", "inverse"] as const,
      description: "The selected look a current pagination page wears.",
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

export default buttonMeta
