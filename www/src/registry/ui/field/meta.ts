import type { RegistryItem } from "@/registry/types"

const fieldMeta = {
  name: "field",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/field/base.tsx",
      target: "ui/field.tsx",
    },
  ],
  registryDependencies: ["text"],
  params: {
    error: {
      default: "plain",
      values: ["plain", "icon-message"] as const,
      files: {
        "icon-message": [
          {
            type: "registry:ui",
            path: "ui/field/base.message.tsx",
            target: "ui/field.tsx",
          },
        ],
      },
      description: "How the error message reads.",
    },
    label: {
      default: "regular",
      values: ["regular", "medium", "semibold"] as const,
      description: "The weight of form-field labels.",
    },
  },
} satisfies RegistryItem

export default fieldMeta
