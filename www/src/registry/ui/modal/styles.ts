import { createStyles } from "@/lib/styles"

import modalMeta from "./meta"

/* Entrances ride the motion tokens (base.css): the character curve and the
   enter / exit durations on the panel, the durations alone on the backdrop.
   Exits keep a plain ease-out. */
const backdropFade =
  "transition-opacity duration-enter group-exiting/modal:duration-exit motion-reduce:transition-none group-entering/modal:opacity-0 group-exiting/modal:opacity-0"

const entrance =
  "duration-enter ease-enter exiting:duration-exit exiting:ease-out motion-reduce:transition-none"

const { useStyles, styles } = createStyles(modalMeta, {
  base: {
    slots: {
      overlay: [
        "group/modal absolute top-0 left-0 isolate z-100 h-(--page-height) w-full",
      ],
      backdrop: [
        "absolute inset-0 bg-overlay/(--modal-backdrop-opacity) backdrop-blur-(--modal-backdrop-blur)",
      ],
      viewport:
        "@container-[size] sticky top-0 left-0 flex h-(--visual-viewport-height) w-full items-center justify-center",
      modal: [
        "relative flex max-h-[calc(var(--visual-viewport-height)-2rem)] w-full max-w-[calc(100vw-2rem)] flex-col rounded-(--modal-radius) border bg-(--modal-background) shadow-[var(--shadow-overlay,var(--shadow-lg))] [--surface-radius:var(--modal-radius)] sm:max-h-[calc(var(--visual-viewport-height)*.9)]",
      ],
    },
  },
  density: {
    compact: { slots: { modal: "sm:max-w-sm" } },
    default: { slots: { modal: "sm:max-w-sm" } },
    comfortable: { slots: { modal: "sm:max-w-md" } },
  },
  params: {
    style: {
      default: {},
      "muted-footer": {
        slots: {
          modal:
            "**:data-[slot=dialog-footer]:-mx-6 **:data-[slot=dialog-footer]:-mb-6 **:data-[slot=dialog-footer]:rounded-b-(--modal-radius) **:data-[slot=dialog-footer]:border-t **:data-[slot=dialog-footer]:bg-muted **:data-[slot=dialog-footer]:px-6 **:data-[slot=dialog-footer]:py-4",
        },
      },
    },
    motion: {
      scale: {
        slots: {
          backdrop: backdropFade,
          modal: [
            "transition-[opacity,scale]",
            entrance,
            "entering:scale-95 entering:opacity-0 exiting:scale-95 exiting:opacity-0",
          ],
        },
      },
      fade: {
        slots: {
          backdrop: backdropFade,
          modal: [
            "transition-opacity",
            entrance,
            "entering:opacity-0 exiting:opacity-0",
          ],
        },
      },
      slide: {
        slots: {
          backdrop: backdropFade,
          modal: [
            "transition-[opacity,translate]",
            entrance,
            "entering:translate-y-2 entering:opacity-0 exiting:translate-y-2 exiting:opacity-0",
          ],
        },
      },
      none: {},
    },
  },
})

export type ModalStyles = typeof styles

export { useStyles }
