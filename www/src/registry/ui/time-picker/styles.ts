import { createStyles } from '@/lib/styles'

import timePickerMeta from './meta'

const { useStyles, styles } = createStyles(timePickerMeta, {
  base: {
    slots: {
      columns: 'flex h-56 gap-1 p-1',
      column: [
        'flex w-14 scroll-py-1 flex-col gap-0.5 overflow-y-auto outline-hidden',
        '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
      ],
      item: [
        'flex h-8 w-full shrink-0 items-center justify-center rounded-md text-sm tabular-nums no-highlight',
        'cursor-interactive outline-hidden transition-colors',
        'hover:bg-accent-muted',
        'focus-visible:focus-ring',
        'selected:bg-accent selected:text-fg-on-accent',
        'disabled:pointer-events-none disabled:text-fg-disabled',
      ],
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type TimePickerStyles = typeof styles

export { styles as timePickerStyles, useStyles }
