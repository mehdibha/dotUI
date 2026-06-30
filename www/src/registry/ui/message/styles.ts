import { createStyles } from '@/lib/styles'

import messageMeta from './meta'

const { useStyles, styles } = createStyles(messageMeta, {
  base: {
    slots: {
      // The row: an optional avatar beside the content column. `align` decides
      // which side it sits on. `group/message` lets actions reveal on hover.
      root: 'group/message flex w-full gap-2.5',
      avatar: 'shrink-0 self-end',
      content: 'flex max-w-[80%] min-w-0 flex-col gap-1',
      // Stays start-aligned regardless of the row's side.
      header: 'self-start px-0.5 text-xs text-fg-muted',
      footer: 'px-0.5 text-xs text-fg-muted',
      group: 'flex flex-col gap-1',
    },
    variants: {
      align: {
        start: {},
        end: { root: 'flex-row-reverse', content: 'items-end' },
      },
    },
    defaultVariants: {
      align: 'start',
    },
  },
  density: {
    compact: { slots: { root: 'gap-2', content: 'gap-0.5' } },
    default: { slots: { root: 'gap-2.5', content: 'gap-1' } },
    comfortable: { slots: { root: 'gap-3', content: 'gap-1.5' } },
  },
})

export type MessageStyles = typeof styles

export { useStyles }
