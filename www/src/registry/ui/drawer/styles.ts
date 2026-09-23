import { createStyles } from "@/lib/styles"

import drawerMeta from "./meta"

const { useStyles, styles } = createStyles(drawerMeta, {
  base: {
    slots: {
      overlay:
        "fixed inset-0 isolate z-50 [--drawer-bleed:--spacing(40)] [--drawer-inset:0px] [--drawer-peek:24px]",
      backdrop:
        "absolute inset-0 opacity-[calc(1-var(--drawer-swipe-progress,0))] transition-opacity duration-500 ease-fluid-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0",
      viewport: "@container-size fixed inset-0 z-10 touch-none",
      popup:
        "relative flex max-h-full min-h-0 w-full min-w-0 flex-col border border-(--overlay-border) bg-popover text-fg shadow-(--shadow-modal,0_-8px_24px_-12px_rgba(0,0,0,0.35)) [transition-property:transform,box-shadow,height,background-color,margin,padding] duration-[calc(500ms*var(--drawer-swipe-strength,1))] ease-fluid-out will-change-[transform,height] outline-none [--drawer-scale-base:calc(max(0,1-(var(--nested-drawers,0)*0.05)))] [--drawer-scale:clamp(0,calc(var(--drawer-scale-base)+(0.05*var(--drawer-stack-progress))),1)] [--drawer-shrink:calc(1-var(--drawer-scale))] [--drawer-stack-offset:max(0px,calc((var(--nested-drawers,0)-var(--drawer-stack-progress))*var(--drawer-peek)))] [--drawer-stack-progress:clamp(0,var(--drawer-swipe-progress,0),1)] [interpolate-size:allow-keywords] data-ending-style:shadow-none data-nested-drawer-open:overflow-hidden data-nested-drawer-swiping:transition-none data-starting-style:shadow-none data-swiping:transition-none data-swiping:select-none",
      handle:
        "mx-auto my-2 shrink-0 cursor-drag touch-none rounded-full bg-fg/20 select-none active:cursor-dragging orientation-horizontal:h-1.5 orientation-horizontal:w-12 orientation-vertical:h-12 orientation-vertical:w-1.5",
      swipeArea: "fixed z-50 touch-none",
      indent:
        "relative z-1 min-h-screen bg-bg transition-[transform,border-radius,box-shadow] ease-fluid-out data-inactive:transform-[translate3d(0,0,0)_scale(1)] data-inactive:rounded-none",
      indentBackground:
        "pointer-events-none fixed inset-0 z-0 bg-overlay transition-opacity duration-500 ease-fluid-out data-inactive:opacity-0 data-active:opacity-100",
    },
    variants: {
      placement: {
        top: {
          viewport: "grid grid-rows-[auto_1fr] pb-12",
          popup:
            "row-start-1 max-h-[calc(100dvh-3rem)] min-h-20 w-full origin-[50%_0] transform-[translateY(var(--drawer-swipe-movement-y,0px))] rounded-b-(--studio-drawer-radius) border-t-0 data-ending-style:transform-[translateY(-100%)] data-nested-drawer-open:h-(--drawer-frontmost-height,var(--drawer-height,auto)) data-nested-drawer-open:transform-[translateY(calc(var(--drawer-swipe-movement-y,0px)+var(--drawer-stack-offset)+(var(--drawer-shrink)*var(--drawer-frontmost-height,var(--drawer-height,0px)))))_scale(var(--drawer-scale))] data-starting-style:transform-[translateY(-100%)]",
          swipeArea: "inset-x-0 top-0 h-8",
        },
        bottom: {
          viewport: "grid grid-rows-[1fr_auto] overflow-visible pt-12",
          popup:
            "row-start-2 mb-[calc(0px-var(--drawer-bleed))] max-h-[calc(100dvh-3rem+var(--drawer-bleed))] min-h-20 w-full origin-[50%_100%] transform-[translateY(calc(max(0px,var(--drawer-snap-point-offset,0px)-var(--drawer-bleed))+var(--drawer-swipe-movement-y,0px)))] rounded-t-(--studio-drawer-radius) border-b-0 pb-[calc(env(safe-area-inset-bottom,0)+var(--drawer-bleed)+var(--drawer-keyboard-inset,0))] data-ending-style:transform-[translateY(100%)] data-nested-drawer-open:h-(--drawer-frontmost-height,var(--drawer-height,auto)) data-nested-drawer-open:transform-[translateY(calc(var(--drawer-swipe-movement-y,0px)-var(--drawer-stack-offset)-(var(--drawer-shrink)*var(--drawer-frontmost-height,var(--drawer-height,0px)))))_scale(var(--drawer-scale))] data-starting-style:transform-[translateY(100%)]",
          swipeArea: "inset-x-0 bottom-0 h-8",
        },
        left: {
          viewport: "flex justify-start pe-12",
          popup:
            "h-full max-w-[calc(100dvw-3rem)] min-w-20 origin-right transform-[translateX(var(--drawer-swipe-movement-x,0px))] rounded-r-(--studio-drawer-radius) border-l-0 data-ending-style:transform-[translateX(-100%)] data-nested-drawer-open:transform-[translateX(calc(var(--drawer-swipe-movement-x,0px)+var(--drawer-stack-offset)))_scale(var(--drawer-scale))] data-starting-style:transform-[translateX(-100%)]",
          swipeArea: "inset-y-0 left-0 w-8",
        },
        right: {
          viewport: "flex justify-end ps-12",
          popup:
            "h-full max-w-[calc(100dvw-3rem)] min-w-20 origin-left transform-[translateX(var(--drawer-swipe-movement-x,0px))] rounded-l-(--studio-drawer-radius) border-r-0 data-ending-style:transform-[translateX(100%)] data-nested-drawer-open:transform-[translateX(calc(var(--drawer-swipe-movement-x,0px)-var(--drawer-stack-offset)))_scale(var(--drawer-scale))] data-starting-style:transform-[translateX(100%)]",
          swipeArea: "inset-y-0 right-0 w-8",
        },
      },
      /* What the page behind does while a drawer is open: scale back under a
         sheet (iOS), or slide aside by --drawer-indent-push for a side menu.
         Transitions drop to zero while a swipe drives the progress. */
      effect: {
        scale: {
          indent:
            "duration-500 data-active:transform-[translate3d(0,calc(8px*(1-var(--drawer-swipe-progress,0))),0)_scale(calc(0.96+0.04*var(--drawer-swipe-progress,0)))] data-active:rounded-2xl",
        },
        push: {
          indent:
            "origin-left duration-[calc(500ms*(1-clamp(0,calc(var(--drawer-swipe-progress,0)*100000),1)))] [--drawer-indent-push:min(85vw,--spacing(80))] data-active:transform-[translate3d(calc(var(--drawer-indent-push)*(1-var(--drawer-swipe-progress,0))),0,0)] data-active:overflow-hidden data-active:rounded-(--studio-drawer-radius) data-active:shadow-[inset_0_0_0_1px_var(--color-border-control)]",
        },
      },
    },
    defaultVariants: {
      placement: "bottom",
      effect: "scale",
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    /* iOS 26 floats a bottom sheet inside the screen edges until it expands
       to its largest snap point; Vaul/shadcn dock it edge to edge. */
    sheet: {
      attached: {},
      floating: {
        slots: {
          popup:
            "data-[swipe-direction=down]:mx-2 data-[swipe-direction=down]:w-auto data-[swipe-direction=down]:rounded-b-(--studio-drawer-radius) data-[swipe-direction=down]:data-expanded:mx-0 data-[swipe-direction=down]:data-expanded:rounded-b-none",
        },
      },
    },
    backdrop: {
      dim: { slots: { backdrop: "bg-overlay/70" } },
      blur: { slots: { backdrop: "bg-overlay/50 backdrop-blur-sm" } },
      none: {},
    },
  },
})

export type DrawerStyles = typeof styles

export { useStyles }
