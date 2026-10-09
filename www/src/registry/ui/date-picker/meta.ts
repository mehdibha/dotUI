import type { RegistryItem } from "@/registry/types"

const datePickerMeta = {
  name: "date-picker",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/date-picker/base.tsx",
      target: "ui/date-picker.tsx",
    },
  ],
  registryDependencies: ["button", "calendar", "field", "input", "dialog"],
} satisfies RegistryItem

export default datePickerMeta
