import { createStyles } from '@/lib/styles'

import gridListMeta from './meta'

const { useStyles, styles } = createStyles(gridListMeta, {
  base: {
    slots: {
      root: [
        'flex max-h-[inherit] scroll-my-1 flex-col gap-px overflow-y-auto p-1 outline-hidden',
        'layout-grid:grid layout-grid:grid-cols-(--grid-list-columns,repeat(auto-fill,minmax(calc(var(--spacing)*32),1fr))) layout-grid:gap-1',
        'data-empty:items-center data-empty:justify-center',
      ],
      item: [
        'group/grid-list-item relative flex cursor-interactive items-center rounded-(--grid-list-item-radius) outline-hidden select-none',
        '**:[svg]:pointer-events-none **:[svg]:shrink-0',
        'hover:bg-highlight hover:text-fg-on-highlight',
        'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-focus',
        'selected:bg-selected selected:text-fg-on-selected selected:hover:bg-selected-hover',
        'drop-target:bg-accent-muted drop-target:text-fg',
        'dragging:opacity-60',
        'disabled:pointer-events-none disabled:text-fg-disabled disabled:**:text-current',
        'has-data-grid-list-item-description:has-[>svg]:pl-8 has-data-grid-list-item-description:*:[svg]:absolute has-data-grid-list-item-description:*:[svg]:top-2 has-data-grid-list-item-description:*:[svg]:left-2',
      ],
      itemLabel: ['flex min-w-0 flex-1 items-center gap-[inherit]'],
      itemDescription: ['w-full text-fg-muted'],
      dragHandle: [
        'flex shrink-0 cursor-grab items-center justify-center text-fg-muted outline-hidden',
      ],
      loadMore: ['flex w-full items-center justify-center py-1 text-fg-muted'],
      section: [
        'scroll-my-1 in-data-[layout=grid]:col-span-full in-data-[layout=grid]:grid in-data-[layout=grid]:grid-cols-subgrid',
      ],
      sectionTitle: [
        'text-xs text-fg-muted in-data-[layout=grid]:col-span-full',
      ],
    },
  },
  density: {
    compact: {
      slots: {
        root: 'text-xs/relaxed',
        item: 'min-h-7 gap-2 px-2 py-1 text-xs/relaxed **:[svg]:not-with-[size]:size-3.5',
        sectionTitle: 'px-2 py-1',
      },
    },
    default: {
      slots: {
        root: 'text-sm',
        item: 'min-h-8 gap-1.5 px-1.5 py-1 text-sm **:[svg]:not-with-[size]:size-4',
        sectionTitle: 'px-1.5 py-1',
      },
    },
    comfortable: {
      slots: {
        root: 'text-sm',
        item: 'min-h-9 gap-2 px-2 py-1.5 text-sm **:[svg]:not-with-[size]:size-4',
        sectionTitle: 'px-2 py-1.5',
      },
    },
  },
  params: {
    highlight: {
      subtle: {
        vars: {
          '--color-highlight': 'var(--neutral-300)',
          '--color-fg-on-highlight': 'var(--on-neutral-300)',
        },
      },
      accent: {
        slots: {
          item: 'hover:**:text-current',
        },
        vars: {
          '--color-highlight': 'var(--accent-500)',
          '--color-fg-on-highlight': 'var(--on-accent-500)',
        },
      },
    },
  },
})

export type GridListStyles = typeof styles

export { useStyles }
