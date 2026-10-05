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
  // Synced with toggle-button: the studio's Buttons style writes both.
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
      description:
        "A real system's button recipe: fills, edges, hover and press.",
    },
  },
} satisfies RegistryItem

export default buttonMeta
