import type { RegistryItem } from "@/registry/types"

const listMeta = {
  name: "list",
  type: "registry:ui",
  group: "menus-lists",
  files: [
    {
      type: "registry:ui",
      path: "ui/list/base.tsx",
      target: "ui/list.tsx",
    },
  ],
  dependencies: ["react-aria-components"],
  params: {
    style: {
      kind: "enum",
      default: "inset",
      values: ["inset", "plain"] as const,
      description:
        "Rows grouped on rounded cards (iOS inset grouped), or full-bleed rows split by separators.",
    },
    tint: {
      kind: "enum",
      default: "accent",
      values: ["accent", "neutral", "selection"] as const,
      description: "The color of accent rows — the link color.",
    },
  },
} satisfies RegistryItem

export default listMeta
