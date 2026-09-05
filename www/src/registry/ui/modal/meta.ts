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
    // Synced with popover and tooltip: the studio's Motion axis writes all three.
    motion: {
      kind: "enum",
      default: "scale",
      values: ["scale", "fade", "slide", "none"] as const,
      description: "How the dialog enters and leaves.",
    },
    mobile: {
      kind: "enum",
      default: "center",
      values: ["center", "sheet"] as const,
      description:
        "Where the modal sits below the mobile line: centered, or docked to the bottom edge as a sheet.",
    },
  },
} satisfies RegistryItem

export default modalMeta
