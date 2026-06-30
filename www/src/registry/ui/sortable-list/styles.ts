import { createStyles } from '@/lib/styles'

import sortableListMeta from './meta'

const { useStyles, styles } = createStyles(sortableListMeta, {
  base: {
    slots: {
      root: 'flex flex-col',
      item: [
        'relative flex touch-none items-center rounded-(--sortable-list-radius) border bg-card text-fg',
        'data-[dragging]:z-10 data-[dragging]:opacity-80 data-[dragging]:shadow-lg',
      ],
      handle: [
        'flex shrink-0 cursor-grab items-center justify-center self-stretch rounded-l-(--sortable-list-radius) text-fg-muted',
        'outline-hidden hover:text-fg focus-visible:focus-ring active:cursor-grabbing disabled:cursor-disabled',
      ],
      content: 'min-w-0 flex-1',
    },
  },
  density: {
    compact: {
      slots: {
        root: 'gap-1.5',
        item: 'text-xs',
        handle: 'w-7 *:[svg]:size-3.5',
        content: 'py-2 pr-3',
      },
    },
    default: {
      slots: {
        root: 'gap-2',
        item: 'text-sm',
        handle: 'w-8 *:[svg]:size-4',
        content: 'py-2.5 pr-3.5',
      },
    },
    comfortable: {
      slots: {
        root: 'gap-2.5',
        item: 'text-sm',
        handle: 'w-9 *:[svg]:size-4',
        content: 'py-3 pr-4',
      },
    },
  },
})

export type SortableListStyles = typeof styles

export { useStyles }
