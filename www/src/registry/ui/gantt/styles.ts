import { createStyles } from '@/lib/styles'

import ganttMeta from './meta'

const { useStyles, styles } = createStyles(ganttMeta, {
  base: {
    slots: {
      root: 'flex w-full overflow-hidden rounded-(--gantt-radius) border bg-card',
      sidebar: 'flex shrink-0 flex-col border-r bg-card',
      sidebarHeader: 'flex shrink-0 items-center border-b font-medium text-fg',
      sidebarRow: 'flex items-center truncate border-b text-fg last:border-b-0',
      timeline: 'relative flex-1 overflow-x-auto',
      grid: 'relative w-max min-w-full',
      header: 'flex border-b',
      headerCell: 'shrink-0 border-r text-center text-fg-muted last:border-r-0',
      headerWeekday: 'leading-none',
      headerDay: 'leading-none font-medium text-fg',
      body: 'relative',
      row: 'relative flex border-b last:border-b-0',
      cell: 'shrink-0 border-r last:border-r-0',
      bar: 'absolute flex items-center overflow-hidden rounded-(--gantt-radius) text-fg-on-primary',
      barLabel: 'truncate font-medium',
      today: 'pointer-events-none absolute top-0 bottom-0 z-10 w-px bg-primary',
    },
  },
  density: {
    compact: {
      slots: {
        sidebarHeader: 'h-9 px-3 text-xs',
        sidebarRow: 'h-9 px-3 text-xs',
        header: 'h-9',
        headerCell: 'flex flex-col items-center justify-center gap-0.5 py-1',
        headerWeekday: 'text-[10px]',
        headerDay: 'text-xs',
        row: 'h-9',
        bar: 'h-6 px-2 text-xs',
      },
    },
    default: {
      slots: {
        sidebarHeader: 'h-10 px-3.5 text-sm',
        sidebarRow: 'h-10 px-3.5 text-sm',
        header: 'h-10',
        headerCell: 'flex flex-col items-center justify-center gap-0.5 py-1',
        headerWeekday: 'text-[10px]',
        headerDay: 'text-xs',
        row: 'h-10',
        bar: 'h-7 px-2.5 text-sm',
      },
    },
    comfortable: {
      slots: {
        sidebarHeader: 'h-12 px-4 text-sm',
        sidebarRow: 'h-12 px-4 text-sm',
        header: 'h-12',
        headerCell: 'flex flex-col items-center justify-center gap-1 py-1.5',
        headerWeekday: 'text-[11px]',
        headerDay: 'text-sm',
        row: 'h-12',
        bar: 'h-8 px-3 text-sm',
      },
    },
  },
})

export type GanttStyles = typeof styles

export { useStyles }
