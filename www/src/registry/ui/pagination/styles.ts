import { createStyles } from '@/modules/core/styles'

import paginationMeta from './meta'

const { useStyles, styles } = createStyles(paginationMeta, {
  base: {
    slots: {
      root: 'mx-auto flex w-full justify-center',
      list: 'flex flex-row items-center gap-1',
      item: '',
      // Sized to match an icon-only page button at the default `md` size, so the
      // ellipsis lines up with the page cells around it.
      ellipsis:
        'flex size-8 items-center justify-center text-fg-muted [&_svg]:size-4',
    },
  },
  density: {
    compact: {
      slots: {
        list: 'gap-0.5',
        ellipsis: 'size-7 [&_svg]:size-3.5',
      },
    },
    default: {},
    comfortable: {
      slots: {
        ellipsis: 'size-9',
      },
    },
  },
})

export type PaginationStyles = typeof styles

export { useStyles }
