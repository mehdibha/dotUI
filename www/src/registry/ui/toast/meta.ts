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
  registryDependencies: ["focus-styles", "button", "loader"],
  params: {
    motion: {
      kind: "enum",
      default: "slide",
      values: ["slide", "none"] as const,
      description: "How a toast enters and leaves.",
    },
    surface: {
      kind: "enum",
      default: "surface",
      values: ["surface", "inverse"] as const,
      description: "The toast's surface.",
    },
    status: {
      kind: "enum",
      default: "icon",
      values: ["icon", "solid-icon", "bold", "soft"] as const,
      description: "How a status toast shows its status.",
    },
  },
} satisfies RegistryItem

export default toastMeta
