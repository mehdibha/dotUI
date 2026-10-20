import type { RegistryItem } from "@/registry/types"

const modalMeta = {
  name: "modal",
  type: "registry:ui",
  files: [
    {
      type: "registry:ui",
      path: "ui/modal/base.tsx",
      target: "ui/modal.tsx",
    },
  ],
  params: {
    position: {
      default: "center",
      values: ["center", "top"] as const,
      description: "Where the modal rests in the viewport.",
    },
    motion: {
      default: "scale",
      values: ["scale", "rise", "drop", "none"] as const,
      description: "How the dialog enters and leaves.",
    },
    mobile: {
      default: "center",
      values: ["center", "sheet", "fullscreen"] as const,
      registryDependencies: {
        sheet: ["sheet", "use-mobile"],
        fullscreen: ["button"],
      },
      files: {
        center: [
          {
            type: "registry:ui",
            path: "ui/modal/base.tsx",
            target: "ui/modal.tsx",
          },
        ],
        sheet: [
          {
            type: "registry:ui",
            path: "ui/modal/base.sheet.tsx",
            target: "ui/modal.tsx",
          },
        ],
        fullscreen: [
          {
            type: "registry:ui",
            path: "ui/modal/base.fullscreen.tsx",
            target: "ui/modal.tsx",
          },
        ],
      },
      description:
        "What the modal becomes below the mobile line: centered, a bottom sheet, or the whole screen.",
    },
  },
} satisfies RegistryItem

export default modalMeta
