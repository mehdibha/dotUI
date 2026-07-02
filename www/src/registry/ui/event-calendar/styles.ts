import { createStyles } from '@/lib/styles'

import eventCalendarMeta from './meta'

const { useStyles, styles } = createStyles(eventCalendarMeta, {
  base: {
    slots: {
      root: 'flex w-full flex-col gap-4 text-fg',
      header: 'flex items-center gap-2',
      heading: 'flex-1 text-sm font-medium',
      nav: 'flex items-center gap-1',
      grid: 'grid grid-cols-7 overflow-hidden rounded-(--event-calendar-radius) border',
      weekday:
        'border-b bg-muted px-2 py-1.5 text-center text-xs font-medium text-fg-muted',
      cell: [
        'flex min-h-24 flex-col gap-1 border-r border-b p-1.5 text-left align-top',
        '[&:nth-child(7n)]:border-r-0',
        '[&:nth-last-child(-n+7)]:border-b-0',
        'data-[outside=true]:bg-muted/40 data-[outside=true]:text-fg-muted',
      ],
      dayNumber:
        'inline-flex size-6 items-center justify-center self-start rounded-full text-xs font-medium tabular-nums data-[today=true]:bg-primary data-[today=true]:text-fg-on-primary',
      events: 'flex min-w-0 flex-col gap-0.5',
      chip: [
        'flex min-w-0 items-center gap-1 rounded-sm px-1.5 py-0.5 text-left text-xs font-medium',
        'bg-[color-mix(in_srgb,var(--chip-color)_18%,var(--color-bg))] text-[color-mix(in_srgb,var(--chip-color)_75%,var(--color-fg))]',
      ],
      chipDot: 'size-1.5 shrink-0 rounded-full bg-(--chip-color)',
      chipLabel: 'truncate',
      more: 'px-1.5 text-xs font-medium text-fg-muted',
    },
    variants: {
      color: {
        primary: { chip: '[--chip-color:var(--color-primary)]' },
        accent: { chip: '[--chip-color:var(--color-accent)]' },
        danger: { chip: '[--chip-color:var(--color-danger)]' },
        success: { chip: '[--chip-color:var(--color-success)]' },
        warning: { chip: '[--chip-color:var(--color-warning)]' },
        info: { chip: '[--chip-color:var(--color-info)]' },
        neutral: { chip: '[--chip-color:var(--color-neutral)]' },
      },
    },
    defaultVariants: {
      color: 'primary',
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type EventCalendarStyles = typeof styles

export { styles as eventCalendarStyles, useStyles }
