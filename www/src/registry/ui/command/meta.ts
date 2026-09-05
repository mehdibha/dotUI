import type { RegistryItem } from "@/registry/types"

const commandMeta = {
  name: "command",
  type: "registry:ui",
  group: "menus-lists",
  files: [
    {
      type: "registry:ui",
      path: "ui/command/base.tsx",
      target: "ui/command.tsx",
    },
  ],
  registryDependencies: ["list-box", "search-field"],
  params: {
    search: {
      kind: "enum",
      default: "field",
      values: ["field", "bar", "prompt"] as const,
      description:
        "The search chrome: a boxed field, a full-bleed bar with the magnifier, or a bare prompt.",
    },
    scale: {
      kind: "enum",
      default: "default",
      values: ["default", "large"] as const,
      description: "Menu scale, or a hero surface with larger input and rows.",
    },
  },
} satisfies RegistryItem

export default commandMeta
