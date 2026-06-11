import { createStyles } from '@/modules/core/styles'

import drawerMeta from './meta'

const { useStyles, styles } = createStyles(drawerMeta, {
  base: {
    slots: {
      overlay:
        'fixed inset-0 isolate z-50 [--drawer-bleed:--spacing(40)] [--drawer-inset:0px] [--drawer-peek:24px]',
      backdrop:
        'absolute inset-0 bg-black/70 opacity-[calc(1-var(--drawer-swipe-progress,0))] transition-opacity duration-500 ease-fluid-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[swiping]:duration-0',
      viewport: '@container-[size] fixed inset-0 z-10 touch-none',
      popup:
        'relative flex max-h-full min-h-0 w-full min-w-0 flex-col border bg-bg text-fg shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.35)] [transition-property:transform,box-shadow,height,background-color,margin,padding] [transition-duration:calc(500ms*var(--drawer-swipe-strength,1))] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] will-change-[transform,height] outline-none [--drawer-scale-base:calc(max(0,1-(var(--nested-drawers,0)*0.05)))] [--drawer-scale:clamp(0,calc(var(--drawer-scale-base)+(0.05*var(--drawer-stack-progress))),1)] [--drawer-shrink:calc(1-var(--drawer-scale))] [--drawer-stack-offset:max(0px,calc((var(--nested-drawers,0)-var(--drawer-stack-progress))*var(--drawer-peek)))] [--drawer-stack-progress:clamp(0,var(--drawer-swipe-progress,0),1)] [interpolate-size:allow-keywords] data-[ending-style]:shadow-none data-[nested-drawer-open]:overflow-hidden data-[nested-drawer-swiping]:transition-none data-[starting-style]:shadow-none data-[swiping]:transition-none data-[swiping]:select-none',
      handle:
        'mx-auto my-2 shrink-0 cursor-grab touch-none rounded-full bg-fg/20 select-none active:cursor-grabbing data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-12 data-[orientation=vertical]:h-12 data-[orientation=vertical]:w-1.5',
      swipeArea: 'fixed z-50 touch-none',
      indent:
        'relative z-1 min-h-screen bg-bg transition-[transform,border-radius] duration-500 ease-fluid-out data-[active]:[transform:translate3d(0,calc(8px*(1-var(--drawer-swipe-progress,0))),0)_scale(calc(0.96+0.04*var(--drawer-swipe-progress,0)))] data-[active]:rounded-2xl data-[inactive]:[transform:translate3d(0,0,0)_scale(1)] data-[inactive]:rounded-none',
      indentBackground:
        'pointer-events-none fixed inset-0 z-0 bg-black transition-opacity duration-500 ease-fluid-out data-[active]:opacity-100 data-[inactive]:opacity-0',
    },
    variants: {
      placement: {
        top: {
          viewport: 'grid grid-rows-[auto_1fr] pb-12',
          popup:
            'row-start-1 max-h-[calc(100dvh_-_3rem)] min-h-20 w-full [transform-origin:50%_0] [transform:translateY(var(--drawer-swipe-movement-y,0px))] rounded-b-xl border-t-0 data-[ending-style]:[transform:translateY(-100%)] data-[nested-drawer-open]:[height:var(--drawer-frontmost-height,var(--drawer-height,auto))] data-[nested-drawer-open]:[transform:translateY(calc(var(--drawer-swipe-movement-y,0px)_+_var(--drawer-stack-offset)_+_(var(--drawer-shrink)_*_var(--drawer-frontmost-height,var(--drawer-height,0px)))))_scale(var(--drawer-scale))] data-[starting-style]:[transform:translateY(-100%)]',
          swipeArea: 'inset-x-0 top-0 h-8',
        },
        bottom: {
          viewport: 'grid grid-rows-[1fr_auto] overflow-visible pt-12',
          popup:
            'row-start-2 [margin-bottom:calc(0px_-_var(--drawer-bleed))] max-h-[calc(100dvh_-_3rem_+_var(--drawer-bleed))] min-h-20 w-full [transform-origin:50%_100%] [transform:translateY(var(--drawer-swipe-movement-y,0px))] rounded-t-xl border-b-0 pb-[calc(env(safe-area-inset-bottom,0px)_+_var(--drawer-bleed))] data-[ending-style]:[transform:translateY(100%)] data-[nested-drawer-open]:[height:var(--drawer-frontmost-height,var(--drawer-height,auto))] data-[nested-drawer-open]:[transform:translateY(calc(var(--drawer-swipe-movement-y,0px)_-_var(--drawer-stack-offset)_-_(var(--drawer-shrink)_*_var(--drawer-frontmost-height,var(--drawer-height,0px)))))_scale(var(--drawer-scale))] data-[starting-style]:[transform:translateY(100%)]',
          swipeArea: 'inset-x-0 bottom-0 h-8',
        },
        left: {
          viewport: 'flex justify-start pe-12',
          popup:
            'h-full max-w-[calc(100dvw_-_3rem)] min-w-20 origin-right [transform:translateX(var(--drawer-swipe-movement-x,0px))] rounded-r-xl border-l-0 data-[ending-style]:[transform:translateX(-100%)] data-[nested-drawer-open]:[transform:translateX(calc(var(--drawer-swipe-movement-x,0px)_+_var(--drawer-stack-offset)))_scale(var(--drawer-scale))] data-[starting-style]:[transform:translateX(-100%)]',
          swipeArea: 'inset-y-0 left-0 w-8',
        },
        right: {
          viewport: 'flex justify-end ps-12',
          popup:
            'h-full max-w-[calc(100dvw_-_3rem)] min-w-20 origin-left [transform:translateX(var(--drawer-swipe-movement-x,0px))] rounded-l-xl border-r-0 data-[ending-style]:[transform:translateX(100%)] data-[nested-drawer-open]:[transform:translateX(calc(var(--drawer-swipe-movement-x,0px)_-_var(--drawer-stack-offset)))_scale(var(--drawer-scale))] data-[starting-style]:[transform:translateX(100%)]',
          swipeArea: 'inset-y-0 right-0 w-8',
        },
      },
    },
    defaultVariants: {
      placement: 'bottom',
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type DrawerStyles = typeof styles

export { useStyles }
