import type { RegistryItem } from "@/registry/types"

const kbdMeta = {
  name: "kbd",
  type: "registry:ui",
  group: "tags",
  files: [
    {
      type: "registry:ui",
      path: "ui/kbd/base.tsx",
      target: "ui/kbd.tsx",
    },
  ],
  params: {
    style: {
      kind: "enum",
      default: "chip",
      values: ["chip", "outline", "keycap"] as const,
      description: "The chrome a keyboard key wears.",
    },
  },
} satisfies RegistryItem

export default kbdMeta
