import { createStyles } from '@/lib/styles'

import messageScrollerMeta from './meta'

const { useStyles, styles } = createStyles(messageScrollerMeta, {
  base: {
    slots: {
      // The frame: clips the viewport and anchors the fades + button.
      // `--scroller-fade` is the color the edges fade to — override it when the
      // transcript sits on a non-default surface.
      root: 'group/scroller relative flex h-full min-h-0 flex-col overflow-hidden [--scroller-fade:var(--color-bg)]',
      viewport: 'min-h-0 flex-1 overflow-y-auto overscroll-contain',
      content: 'flex min-h-0 flex-col',
      item: 'scroll-mt-4',
      // Scroll-aware edge fades.
      fadeTop:
        'pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-[var(--scroller-fade)] to-transparent opacity-0 transition-opacity duration-200 group-data-[scrolled]/scroller:opacity-100',
      fadeBottom:
        'pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-[var(--scroller-fade)] to-transparent opacity-100 transition-opacity duration-200 group-data-[at-bottom]/scroller:opacity-0',
      button:
        'pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 translate-y-1 rounded-full opacity-0 shadow-md transition duration-200 data-[visible]:pointer-events-auto data-[visible]:translate-y-0 data-[visible]:opacity-100',
    },
  },
  density: {
    compact: { slots: { content: 'gap-3 p-3' } },
    default: { slots: { content: 'gap-5 p-4' } },
    comfortable: { slots: { content: 'gap-6 p-5' } },
  },
})

export type MessageScrollerStyles = typeof styles

export { useStyles }
