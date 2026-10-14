import type { RegistryItem } from "@/registry/types"

const toastMeta = {
  name: "toast",
  type: "registry:ui",
  dependencies: ["@base-ui/react"],
  files: [
    {
      type: "registry:ui",
      path: "ui/toast/base.tsx",
      target: "ui/toast.tsx",
    },
  ],
  params: {
    motion: {
      default: "slide",
      values: ["slide", "fade", "none"] as const,
      description: "How a toast enters and leaves.",
    },
  },
} satisfies RegistryItem

export default toastMeta
