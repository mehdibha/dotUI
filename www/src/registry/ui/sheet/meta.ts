import type { RegistryItem } from "@/registry/types"

const sheetMeta = {
  name: "sheet",
  type: "registry:ui",
  dependencies: ["react-aria-components@^1.22.0", "react-aria@^3.53.0"],
  files: [
    {
      type: "registry:ui",
      path: "ui/sheet/base.tsx",
      target: "ui/sheet.tsx",
    },
  ],
  params: {
    edge: {
      default: "docked",
      values: ["docked", "detached"] as const,
      description:
        "How the sheet meets the screen: flush to its edge, or a card inset from it.",
    },
  },
} satisfies RegistryItem

export default sheetMeta
