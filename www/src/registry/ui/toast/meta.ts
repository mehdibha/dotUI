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
    style: {
      kind: "enum",
      default: "surface",
      values: ["surface", "inverted", "filled", "accent-bar"] as const,
      description: "How much intent color the toast surface carries.",
    },
    position: {
      kind: "enum",
      default: "bottom-right",
      values: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ] as const,
      description: "Where the provider stacks toasts unless told otherwise.",
    },
  },
} satisfies RegistryItem

export default toastMeta
