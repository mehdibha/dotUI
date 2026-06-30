import { createStyles } from '@/lib/styles'

import mapPickerMeta from './meta'

const { useStyles, styles } = createStyles(mapPickerMeta, {
  base: {
    slots: {
      root: 'flex w-full flex-col gap-3',
      surface:
        'relative h-[360px] w-full overflow-hidden rounded-(--map-picker-radius) border bg-muted',
      footer: 'flex flex-wrap items-center justify-between gap-2 text-fg-muted',
      coords: 'font-mono tabular-nums',
    },
  },
  density: {
    compact: {
      slots: {
        footer: 'text-xs',
      },
    },
    default: {
      slots: {
        footer: 'text-sm',
      },
    },
    comfortable: {
      slots: {
        footer: 'text-sm',
      },
    },
  },
})

export type MapPickerStyles = typeof styles

export { useStyles }
