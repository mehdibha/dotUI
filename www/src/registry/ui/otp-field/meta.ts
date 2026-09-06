import type { RegistryItem } from "@/registry/types"

const otpFieldMeta = {
  name: "otp-field",
  type: "registry:ui",
  group: "inputs",
  files: [
    {
      type: "registry:ui",
      path: "ui/otp-field/base.tsx",
      target: "ui/otp-field.tsx",
    },
  ],
  dependencies: ["@base-ui/react"],
  registryDependencies: ["field", "input"],
  params: {
    cells: {
      kind: "enum",
      default: "group",
      values: ["group", "boxes", "underline"] as const,
      description:
        "How the digit cells sit: one attached group, separate boxes, or a dash per digit.",
    },
  },
} satisfies RegistryItem

export default otpFieldMeta
