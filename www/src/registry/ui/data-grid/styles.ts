import { createStyles } from '@/lib/styles'

import dataGridMeta from './meta'

const { useStyles, styles } = createStyles(dataGridMeta, {
  base: {
    slots: {
      root: 'flex w-full flex-col gap-3',
      sortButton: [
        'group/sort -mx-1.5 inline-flex h-7 max-w-full items-center gap-1.5 rounded-sm px-1.5 font-medium text-fg-muted outline-hidden transition-colors',
        'hover:text-fg focus-visible:focus-ring data-[sorted]:text-fg',
      ],
      sortLabel: 'min-w-0 truncate',
      sortIcon:
        'size-3.5 shrink-0 opacity-60 group-data-[sorted]/sort:opacity-100',
      footer: 'flex items-center justify-between gap-3',
      pageInfo: 'text-sm text-fg-muted tabular-nums',
      actions: 'flex items-center gap-2',
    },
  },
})

export type DataGridStyles = typeof styles

export { useStyles }
