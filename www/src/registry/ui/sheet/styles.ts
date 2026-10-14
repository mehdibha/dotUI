import { createStyles } from "@/lib/styles"

import sheetMeta from "./meta"

const { useStyles, styles } = createStyles(sheetMeta, {
  base: {
    slots: {
      // A leaving sheet lets the next tap through to the page.
      overlay: "isolate z-50 exiting:pointer-events-none",
      backdrop: "",
      /* Content-box, so the overscroll padding react-aria adds past the swipe
         edge stays out of the sheet's size. */
      sheet:
        "relative box-content flex min-h-0 min-w-0 flex-col overflow-clip border border-(--overlay-border) bg-popover text-fg shadow-(--shadow-modal,0_-8px_24px_-12px_rgba(0,0,0,0.35)) outline-none [--surface-bg:var(--color-popover)]",
      /* A dialog shrinks to fit and scrolls its body; a menu or listbox
         overflows and this scrolls, only once fully revealed so a partly
         open sheet swipes as one. */
      content:
        "flex min-h-0 flex-1 flex-col overflow-hidden pb-(--sheet-scroll-padding-y) outline-none in-data-expanded:overflow-y-auto",
      handle:
        "mx-auto my-2 shrink-0 rounded-(--studio-sheet-handle-radius) bg-fg/20 orientation-horizontal:h-1.5 orientation-horizontal:w-12 orientation-vertical:h-12 orientation-vertical:w-1.5",
    },
    variants: {
      position: {
        top: {
          sheet:
            "max-h-[calc(100dvh-3rem)] w-full origin-bottom rounded-b-(--studio-sheet-radius) border-t-0 [--sheet-stack-offset:0_1rem]",
          content: "pt-[env(safe-area-inset-top,0px)]",
        },
        bottom: {
          sheet:
            "max-h-[calc(100dvh-3rem)] w-full origin-top rounded-t-(--studio-sheet-radius) border-b-0 [--sheet-stack-offset:0_-1rem]",
          content:
            "pb-[calc(env(safe-area-inset-bottom,0px)+var(--sheet-scroll-padding-y))]",
        },
        left: {
          sheet:
            "h-full w-3/4 origin-right rounded-r-(--studio-sheet-radius) border-l-0 [--sheet-stack-offset:-1rem_0] sm:max-w-sm",
          content:
            "pb-[calc(env(safe-area-inset-bottom,0px)+var(--sheet-scroll-padding-y))]",
        },
        right: {
          sheet:
            "h-full w-3/4 origin-left rounded-l-(--studio-sheet-radius) border-r-0 [--sheet-stack-offset:1rem_0] sm:max-w-sm",
          content:
            "pb-[calc(env(safe-area-inset-bottom,0px)+var(--sheet-scroll-padding-y))]",
        },
        center: {
          sheet:
            "max-h-[calc(100dvh-3rem)] w-[calc(100%-2rem)] max-w-lg rounded-(--studio-sheet-radius) [--sheet-stack-offset:0_-1rem]",
        },
      },
    },
    defaultVariants: {
      position: "bottom",
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    // Only the bottom-most sheet of a stack dims the page.
    backdrop: {
      dim: { slots: { backdrop: "data-[stack-index=0]:bg-overlay/70" } },
      blur: {
        slots: {
          backdrop:
            "data-[stack-index=0]:bg-overlay/50 data-[stack-index=0]:backdrop-blur-sm",
        },
      },
      none: {},
    },
  },
})

export type SheetStyles = typeof styles

export { useStyles }
