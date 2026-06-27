import { createStyles } from '@/lib/styles'

import popoverMeta from './meta'

const { useStyles, styles } = createStyles(popoverMeta, {
  base: {
    slots: {
      popover: [
        'popover z-50 min-w-[max(var(--trigger-width),--spacing(32))] origin-(--trigger-anchor-point) rounded-(--popover-radius) border bg-popover shadow-md forced-color-adjust-none outline-none',
        'transition-[transform,opacity,scale] duration-200 ease-out will-change-[transform,opacity,scale] [--slide-offset:--spacing(0.5)]',
        'entering:scale-95 entering:transform-(--origin) entering:opacity-0',
        'exiting:scale-95 exiting:transform-(--origin) exiting:opacity-0 exiting:duration-150',
        'placement-left:[--origin:translateX(var(--slide-offset))] placement-right:[--origin:translateX(calc(var(--slide-offset)*-1))] placement-top:[--origin:translateY(var(--slide-offset))] placement-bottom:[--origin:translateY(calc(var(--slide-offset)*-1))]',
      ],
      arrow: [
        'block [&>svg]:size-2.5 [&>svg]:fill-popover',
        'placement-left:[&>svg]:-rotate-90 placement-right:[&>svg]:rotate-90 placement-bottom:[&>svg]:rotate-180',
      ],
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type PopoverStyles = typeof styles

export { useStyles }
