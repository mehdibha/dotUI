import type { RegistryItem } from "@/registry/types"

const disclosureMeta = {
  name: "disclosure",
  type: "registry:ui",
  group: "disclosure",
  files: [
    {
      type: "registry:ui",
      path: "ui/disclosure/base.tsx",
      target: "ui/disclosure.tsx",
    },
  ],
  params: {
    marker: {
      kind: "enum",
      default: "chevron",
      values: ["chevron", "plus"] as const,
      description:
        "The glyph that shows a trigger opens: a turning chevron or a plus that becomes a minus.",
    },
    markerPosition: {
      kind: "enum",
      default: "trailing",
      values: ["trailing", "leading"] as const,
    },
  },
} satisfies RegistryItem

export default disclosureMeta
