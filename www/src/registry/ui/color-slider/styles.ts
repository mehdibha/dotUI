import { createStyles } from '@/lib/styles'

import colorSliderMeta from './meta'

const { useStyles, styles } = createStyles(colorSliderMeta, {
  base: {
    slots: {
      root: 'flex flex-col gap-2',
      output: 'text-sm text-fg-muted',
      track:
        'relative rounded-md disabled:[background:var(--color-disabled)]! orientation-horizontal:**:data-[slot=color-thumb]:top-1/2 orientation-vertical:**:data-[slot=color-thumb]:left-1/2',
    },
    variants: {
      orientation: {
        horizontal: {
          root: 'w-48',
          track: 'h-6 w-full',
        },
        vertical: {
          root: 'h-48 items-center',
          track: 'w-6 flex-1',
        },
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type ColorSliderStyles = typeof styles

export { useStyles }
