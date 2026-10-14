import type { RegistryItem } from "@/registry/types"

const sheetMeta = {
  name: "sheet",
  type: "registry:ui",
  group: "overlays",
  // The first releases with Sheet.
  dependencies: ["react-aria-components@^1.22.0", "react-aria@^3.53.0"],
  files: [
    {
      type: "registry:ui",
      path: "ui/sheet/base.tsx",
      target: "ui/sheet.tsx",
    },
  ],
  params: {
    backdrop: {
      kind: "enum",
      default: "dim",
      values: ["dim", "blur", "none"] as const,
      description: "How the page reads under the open sheet.",
    },
  },
} satisfies RegistryItem

export default sheetMeta
