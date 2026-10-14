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
      values: ["segmented", "line", "pill"] as const,
      description:
        "The default look of a tab list; the `variant` prop overrides it.",
    },
    color: {
      kind: "enum",
      default: "neutral",
      values: ["neutral", "accent"] as const,
      description: "The line indicator: the text color, or the brand.",
    },
    indicator: {
      kind: "enum",
      default: "full",
      values: ["full", "label"] as const,
      description: "The line indicator: across the tab, or hugging its label.",
    },
    chip: {
      kind: "enum",
      default: "tone",
      values: ["tone", "raised", "ring", "inverse"] as const,
      description: "The segmented chip, as on the segmented control.",
    },
    track: {
      kind: "enum",
      default: "filled",
      values: ["filled", "outline"] as const,
      description: "The segmented track, as on the segmented control.",
    },
    pill: {
      kind: "enum",
      default: "tone",
      values: ["tone", "solid", "tint", "inverse"] as const,
      description: "The selected pill: a quiet toggle's selected look.",
    },
    weight: {
      kind: "enum",
      default: "medium",
      values: [
        "regular",
        "regular-medium",
        "regular-semibold",
        "medium",
        "medium-semibold",
        "semibold",
        "bold",
      ] as const,
      description: "Tab weight at rest, then selected.",
    },
    case: {
      kind: "enum",
      default: "sentence",
      values: ["sentence", "uppercase"] as const,
      description: "Tab label case.",
    },
  },
} satisfies RegistryItem

export default tabsMeta
