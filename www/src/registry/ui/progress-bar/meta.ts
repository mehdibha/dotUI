import type { RegistryItem } from "@/registry/types"

const progressBarMeta = {
  name: "progress-bar",
  type: "registry:ui",
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
      default: "thin",
      values: ["thin", "thick"] as const,
    },
    indeterminate: {
      default: "slide",
      values: ["slide", "pulse"] as const,
    },
    gap: {
      default: "none",
      values: ["none", "cut"] as const,
    },
  },
} satisfies RegistryItem

export default progressBarMeta
