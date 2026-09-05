import type { RegistryItem } from "@/registry/types"

const modalMeta = {
  name: "modal",
  type: "registry:ui",
  group: "overlays",
  files: [
    {
      type: "registry:ui",
      path: "ui/modal/base.tsx",
      target: "ui/modal.tsx",
    },
  ],
  params: {
    // Synced with drawer: one Dialogs axis writes both backdrops.
    backdrop: {
      kind: "enum",
      default: "dim",
      values: ["dim", "blur", "none"] as const,
      description: "How the page reads under the open modal.",
    },
    position: {
      kind: "enum",
      default: "center",
      values: ["center", "top"] as const,
      description: "Where the modal rests in the viewport.",
    },
  },
} satisfies RegistryItem

export default modalMeta
