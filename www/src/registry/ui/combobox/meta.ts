import type { RegistryItem } from "@/registry/types"

const comboboxMeta = {
  name: "combobox",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/combobox/base.tsx",
      target: "ui/combobox.tsx",
    },
  ],
  registryDependencies: ["field", "button", "input", "list-box", "popover"],
} satisfies RegistryItem

export default comboboxMeta
