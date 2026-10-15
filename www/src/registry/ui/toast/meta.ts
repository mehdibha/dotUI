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
  registryDependencies: ["button", "loader"],
  params: {
    motion: {
      default: "slide",
      values: ["slide", "none"] as const,
      description: "How a toast enters and leaves.",
    },
    surface: {
      default: "surface",
      values: ["surface", "inverse"] as const,
      description: "The toast's surface.",
    },
    status: {
      default: "icon",
      values: ["icon", "solid-icon", "bold", "soft"] as const,
      description: "How a status toast shows its status.",
    },
  },
} satisfies RegistryItem

export default toastMeta
