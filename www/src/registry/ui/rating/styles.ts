import { createStyles } from '@/lib/styles'

import ratingMeta from './meta'

const { useStyles, styles } = createStyles(ratingMeta, {
  base: {
    slots: {
      root: 'group/rating inline-flex items-center gap-0.5',
      item: 'cursor-(--rating-cursor) rounded-sm text-fg-muted outline-hidden transition-colors focus-visible:focus-ring disabled:cursor-disabled disabled:text-fg-disabled data-[active]:text-(--rating-color) [&>svg]:size-(--rating-size)',
    },
  },
})

export type RatingStyles = typeof styles

export { useStyles }
