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
  // Synced with toggle-button: the studio's Buttons style writes both.
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
  },
} satisfies RegistryItem

export default buttonMeta
