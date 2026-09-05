import type { RegistryItem } from "@/registry/types"

const progressBarMeta = {
  name: "progress-bar",
  type: "registry:ui",
  group: "progress",
  files: [
    {
      type: "registry:ui",
      path: "ui/progress-bar/base.tsx",
      target: "ui/progress-bar.tsx",
    },
  ],
  registryDependencies: ["field"],
  params: {
    track: {
      kind: "enum",
      default: "thin",
      values: ["thin", "thick"] as const,
    },
    indeterminate: {
      kind: "enum",
      default: "slide",
      values: ["slide", "pulse"] as const,
    },
    gap: {
      kind: "enum",
      default: "none",
      values: ["none", "cut"] as const,
    },
  },
} satisfies RegistryItem

export default progressBarMeta
