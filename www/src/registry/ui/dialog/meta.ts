import type { RegistryItem } from "@/registry/types"

const dialogMeta = {
  name: "dialog",
  type: "registry:ui",
  group: "overlays",
  files: [
    {
      type: "registry:ui",
      path: "ui/dialog/base.tsx",
      target: "ui/dialog.tsx",
    },
  ],
  registryDependencies: ["responsive", "modal", "drawer", "popover", "button"],
  params: {
    sections: {
      kind: "enum",
      default: "open",
      values: ["open", "on-scroll", "divided", "header-band"] as const,
      description:
        "How the header and body divide in a modal or drawer: open, a rule while the body scrolls, a header rule, or a tinted header band.",
    },
    footer: {
      kind: "enum",
      default: "end",
      values: [
        "end",
        "spread",
        "stack",
        "bleed",
        "end-rule",
        "spread-rule",
        "stack-rule",
        "end-band",
        "spread-band",
        "stack-band",
      ] as const,
      description:
        "The footer: actions at the end, spread apart, stacked, or bleeding to the edges; optionally under a rule or in a tinted band.",
    },
    close: {
      kind: "enum",
      default: "quiet",
      values: ["quiet", "filled", "faint"] as const,
      description:
        "The close button: quiet, on a filled chip, or faint until hovered.",
    },
    titles: {
      kind: "enum",
      default: "quiet",
      values: ["quiet", "compact", "tight", "bold", "display", "caps"] as const,
      description: "The title recipe: size, weight, tracking and case.",
    },
  },
} satisfies RegistryItem

export default dialogMeta
