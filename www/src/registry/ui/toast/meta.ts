import type { RegistryItem } from "@/registry/types"

const toastMeta = {
  name: "toast",
  type: "registry:ui",
  group: "feedback",
  dependencies: ["@base-ui/react"],
  files: [
    {
      type: "registry:ui",
      path: "ui/toast/base.tsx",
      target: "ui/toast.tsx",
    },
  ],
  registryDependencies: ["focus-styles"],
  params: {
    motion: {
      kind: "enum",
      default: "slide",
      values: ["slide", "fade", "none"] as const,
      description: "How a toast enters and leaves.",
    },
  },
} satisfies RegistryItem

export default toastMeta
