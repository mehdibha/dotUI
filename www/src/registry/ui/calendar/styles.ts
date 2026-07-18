import { createStyles } from '@/lib/styles'

import calendarMeta from './meta'

const { useStyles, styles } = createStyles(calendarMeta, {
  base: {
    slots: {
      root: 'flex w-fit max-w-full flex-col gap-4 [--cell-radius:var(--calendar-cell-radius)] [--cell-size:var(--calendar-cell-size)]',
      header: 'flex items-center gap-2',
      heading: 'flex-1 text-center text-sm font-medium',
      grid: 'grid grid-cols-7 gap-y-2',
      gridHeader: 'contents *:[tr]:contents',
      gridHeaderCell: 'text-xs font-normal text-fg-muted',
      gridBody: 'contents *:[tr]:contents',
      cell: [
        'relative flex aspect-square size-full items-center justify-center text-center text-sm font-medium no-highlight',
        'min-w-(--cell-size) cursor-interactive',
        'disabled:text-fg-disabled unavailable:text-fg-disabled unavailable:line-through outside-month:text-fg-disabled',
        'in-data-range-calendar:not-outside-month:selected:bg-accent-muted selection-start:rounded-l-full selection-end:rounded-r-full',
        'in-data-range-calendar:[td:has(+td>[data-outside-month])>&[data-selected]:not([data-selection-end])]:rounded-r-(--calendar-range-radius)',
        'in-data-range-calendar:[td:has(>[data-outside-month])+td>&[data-selected]:not([data-selection-start])]:rounded-l-(--calendar-range-radius)',
        'in-data-range-calendar:[td:first-child>&[data-selected]:not([data-selection-start])]:rounded-l-(--calendar-range-radius)',
        'in-data-range-calendar:[td:last-child>&[data-selected]:not([data-selection-end])]:rounded-r-(--calendar-range-radius)',
        'focus-reset in-data-calendar:rounded-(--cell-radius) in-data-calendar:transition-shadow in-data-calendar:hover:bg-accent-muted in-data-calendar:focus-visible:focus-ring in-data-calendar:selected:not-outside-month:bg-accent in-data-calendar:selected:not-outside-month:text-fg-on-accent',
        'outside-month:pointer-events-none',
        'in-data-calendar:not-outside-month:invalid:selected:bg-danger in-data-calendar:not-outside-month:invalid:selected:text-fg-on-danger',
      ],
      cellInner:
        'flex size-full items-center justify-center rounded-(--cell-radius) focus-reset transition-shadow not-in-selection-start:not-in-selection-end:hover:bg-accent-muted in-focus-visible:focus-ring in-data-calendar:contents in-selection-start:not-in-outside-month:bg-accent in-selection-start:not-in-outside-month:text-fg-on-accent in-selection-end:not-in-outside-month:bg-accent in-selection-end:not-in-outside-month:text-fg-on-accent',
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type CalendarStyles = typeof styles

export { styles as calendarStyles, useStyles }
