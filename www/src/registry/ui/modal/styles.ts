import { createStyles } from "@/lib/styles"

import modalMeta from "./meta"

/* The entrance's timing is the studio's (styles.css); the backdrop fades on
   the panel's. */
const backdropFade =
  "transition-opacity duration-(--studio-modal-enter-duration) ease-(--studio-modal-ease) group-exiting/modal:duration-(--studio-modal-exit-duration) group-exiting/modal:ease-(--studio-modal-exit-ease) motion-reduce:transition-none group-entering/modal:opacity-0 group-exiting/modal:opacity-0"

const entrance =
  "duration-(--studio-modal-enter-duration) ease-(--studio-modal-ease) exiting:duration-(--studio-modal-exit-duration) exiting:ease-(--studio-modal-exit-ease) motion-reduce:transition-none"

const { useStyles, styles } = createStyles(modalMeta, {
  base: {
    slots: {
      // The drawers' layer, so the last opened sits on top: a select's
      // drawer opens over its modal.
      overlay: [
        "group/modal absolute top-0 left-0 isolate z-50 h-(--page-height) w-full",
      ],
      backdrop: [
        "absolute inset-0 bg-scrim backdrop-blur-(--studio-scrim-blur)",
      ],
      viewport:
        "@container-size sticky top-0 left-0 flex h-(--visual-viewport-height) w-full justify-center",
      modal: [
        "relative flex w-full max-w-[calc(100vw-2rem)] flex-col rounded-(--studio-modal-radius) border border-(--overlay-border) bg-popover shadow-(--shadow-modal,var(--shadow-lg)) [--surface-bg:var(--color-popover)] [--surface-radius:var(--studio-modal-radius)]",
      ],
    },
  },
  density: {
    compact: { slots: { modal: "sm:max-w-sm" } },
    default: { slots: { modal: "sm:max-w-sm" } },
    comfortable: { slots: { modal: "sm:max-w-md" } },
    spacious: { slots: { modal: "sm:max-w-md" } },
    touch: { slots: { modal: "sm:max-w-md" } },
  },
  params: {
    position: {
      center: {
        slots: {
          viewport: "items-center",
          modal:
            "max-h-[calc(var(--visual-viewport-height)-2rem)] sm:max-h-[calc(var(--visual-viewport-height)*0.9)]",
        },
      },
      top: {
        slots: {
          viewport: "items-start pt-[10vh]",
          modal: "max-h-[calc(var(--visual-viewport-height)-10vh-1rem)]",
        },
      },
    },
    motion: {
      // shadcn's: fade and zoom from 95%, both ways.
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
      // Up from below (Spectrum 2, Polaris, Atlassian).
      rise: {
        slots: {
          backdrop: backdropFade,
          modal: [
            "transition-[opacity,translate]",
            entrance,
            "entering:translate-y-2 entering:opacity-0 exiting:translate-y-2 exiting:opacity-0",
          ],
        },
      },
      // Down from above (Carbon, Mantine).
      drop: {
        slots: {
          backdrop: backdropFade,
          modal: [
            "transition-[opacity,translate]",
            entrance,
            "entering:-translate-y-2 entering:opacity-0 exiting:-translate-y-2 exiting:opacity-0",
          ],
        },
      },
      none: {},
    },
    /* Below the mobile line. Sheet swaps the panel for a Drawer
       (base.sheet.tsx); Fullscreen (base.fullscreen.tsx, which adds a close
       button) fills the visual viewport, its min sizes beating the max sizes
       the position and density set, and stretches the dialog so its footer
       rests on the bottom edge, clear of the home indicator. */
    mobile: {
      center: {},
      sheet: {},
      fullscreen: {
        slots: {
          viewport: "max-md:pt-0",
          modal:
            "max-md:min-h-(--visual-viewport-height) max-md:min-w-full max-md:rounded-none max-md:border-0 max-md:pb-[env(safe-area-inset-bottom)] max-md:[--surface-radius:0px] max-md:*:max-h-none max-md:*:flex-1 max-md:**:data-[slot=dialog-footer]:mt-auto",
        },
      },
    },
  },
})

export type ModalStyles = typeof styles

export { useStyles }
