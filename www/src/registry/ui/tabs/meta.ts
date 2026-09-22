import type { RegistryItem } from "@/registry/types"

const tabsMeta = {
  name: "tabs",
  type: "registry:ui",
  group: "navigation",
  files: [
    {
      type: "registry:ui",
      path: "ui/tabs/base.tsx",
      target: "ui/tabs.tsx",
    },
  ],
  registryDependencies: ["context", "focus-styles"],
  params: {
    style: {
      kind: "enum",
      default: "segmented",
      values: ["segmented", "line", "pill", "enclosed"] as const,
      description:
        "The default look of a tab list; the `variant` prop overrides it.",
    },
    color: {
      kind: "enum",
      default: "neutral",
      values: ["neutral", "accent"] as const,
      description: "The selected tab's ink: the text color, or the brand.",
    },
  },
} satisfies RegistryItem

export default tabsMeta
