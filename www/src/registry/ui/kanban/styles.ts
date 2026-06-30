import { createStyles } from '@/lib/styles'

import kanbanMeta from './meta'

const { useStyles, styles } = createStyles(kanbanMeta, {
  base: {
    slots: {
      root: 'group/kanban flex items-start overflow-x-auto overscroll-x-contain',
      column:
        'flex w-72 shrink-0 flex-col rounded-(--kanban-radius) border bg-muted',
      columnHeader: 'flex items-center justify-between',
      columnTitle: 'font-medium text-fg',
      columnCount:
        'inline-flex items-center justify-center rounded-full bg-bg text-fg-muted tabular-nums',
      list: 'flex min-h-2 flex-1 flex-col overflow-y-auto',
      card: 'rounded-(--kanban-radius) border bg-card text-fg shadow-xs outline-hidden focus-visible:focus-ring data-[dragging]:opacity-40 data-[overlay]:cursor-grabbing data-[overlay]:shadow-md',
    },
  },
  density: {
    compact: {
      slots: {
        root: 'gap-2',
        column: 'gap-2 p-2 text-xs',
        columnHeader: 'px-1',
        columnTitle: 'text-xs',
        columnCount: 'size-4 text-[10px]',
        list: 'gap-2',
        card: 'p-2 text-xs',
      },
    },
    default: {
      slots: {
        root: 'gap-3',
        column: 'gap-3 p-3 text-sm',
        columnHeader: 'px-1',
        columnTitle: 'text-sm',
        columnCount: 'size-5 text-xs',
        list: 'gap-2',
        card: 'p-3 text-sm',
      },
    },
    comfortable: {
      slots: {
        root: 'gap-4',
        column: 'gap-4 p-4 text-sm',
        columnHeader: 'px-1',
        columnTitle: 'text-base',
        columnCount: 'size-6 text-xs',
        list: 'gap-3',
        card: 'p-4 text-sm',
      },
    },
  },
})

export type KanbanStyles = typeof styles

export { useStyles }
