import type { RegistryItem } from "@/registry/types"

const alertMeta = {
  name: "alert",
  type: "registry:ui",
  group: "feedback",
  files: [
    {
      type: "registry:ui",
      path: "ui/alert/base.tsx",
      target: "ui/alert.tsx",
    },
  ],
  params: {
    style: {
      kind: "enum",
      default: "neutral",
      values: ["neutral", "tinted", "tinted-border", "accent-bar"] as const,
      description: "How much intent color the alert surface carries.",
    },
  },
} satisfies RegistryItem

export default alertMeta
