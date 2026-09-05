import { createStyles } from "@/lib/styles"

import modalMeta from "./meta"

const { useStyles, styles } = createStyles(modalMeta, {
  base: {
    slots: {
      overlay: [
        "group/modal absolute top-0 left-0 isolate z-100 h-(--page-height) w-full",
      ],
      backdrop: [
        "absolute inset-0 duration-200 group-exiting/modal:duration-150",
        "transition-opacity group-entering/modal:opacity-0 group-exiting/modal:opacity-0",
      ],
      viewport:
        "@container-[size] sticky top-0 left-0 flex h-(--visual-viewport-height) w-full justify-center",
      modal: [
        "relative flex w-full max-w-[calc(100vw-2rem)] flex-col rounded-(--modal-radius) border bg-(--modal-background) shadow-[var(--shadow-overlay,var(--shadow-lg))] [--surface-radius:var(--modal-radius)]",
        "transition-[opacity,scale] ease-[cubic-bezier(0.165,0.84,0.44,1)]",
        "duration-200 entering:scale-95 entering:opacity-0",
        "exiting:scale-95 exiting:opacity-0 exiting:duration-150",
      ],
    },
  },
  density: {
    compact: { slots: { modal: "sm:max-w-sm" } },
    default: { slots: { modal: "sm:max-w-md" } },
    comfortable: { slots: { modal: "sm:max-w-md" } },
  },
  params: {
    backdrop: {
      dim: { slots: { backdrop: "bg-overlay/40" } },
      blur: { slots: { backdrop: "bg-overlay/30 backdrop-blur-sm" } },
      none: {},
    },
    position: {
      center: {
        slots: {
          viewport: "items-center",
          modal:
            "max-h-[calc(var(--visual-viewport-height)-2rem)] sm:max-h-[calc(var(--visual-viewport-height)*.9)]",
        },
      },
      top: {
        slots: {
          viewport: "items-start pt-[10vh]",
          modal: "max-h-[calc(var(--visual-viewport-height)-10vh-1rem)]",
        },
      },
    },
  },
})

export type ModalStyles = typeof styles

export { useStyles }
