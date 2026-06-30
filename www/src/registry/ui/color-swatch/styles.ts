import { createStyles } from '@/lib/styles'

import colorSwatchMeta from './meta'

const { useStyles, styles } = createStyles(colorSwatchMeta, {
  base: {
    base: 'relative size-5 shrink-0 rounded-(--color-swatch-radius) border',
  },
})

export type ColorSwatchStyles = typeof styles

export { useStyles }
