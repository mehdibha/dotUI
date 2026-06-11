import { createStyles } from '@/modules/core/styles'

import colorSliderMeta from './meta'

const { useStyles, styles } = createStyles(colorSliderMeta, {
  base: {
    slots: {
      root: 'flex flex-col gap-2',
      output: 'text-sm text-fg-muted',
      track:
        "relative rounded-md before:absolute before:inset-0 before:z-[-1] before:rounded-[inherit] before:bg-[repeating-conic-gradient(#e6e6e6_0%_25%,#fff_0%_50%)] before:bg-size-[16px_16px] before:bg-center before:content-[''] disabled:[background:var(--color-disabled)]! orientation-horizontal:**:data-[slot=color-thumb]:top-1/2 orientation-vertical:**:data-[slot=color-thumb]:left-1/2",
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
