import { createStyles } from '@/modules/core/styles'

import treeMeta from './meta'

const { useStyles, styles } = createStyles(treeMeta, {
  base: {
    slots: {
      root: [
        'flex max-h-[inherit] flex-col overflow-auto p-1 outline-hidden',
        '[--tree-indent:--spacing(5)]',
        'data-empty:items-center data-empty:justify-center',
      ],
      item: [
        'group/tree-item relative flex w-full cursor-interactive items-center rounded-(--tree-item-radius) outline-hidden select-none',
        '**:[svg]:pointer-events-none **:[svg]:shrink-0',
        'hover:bg-highlight hover:text-fg-on-highlight',
        'focus-visible:bg-highlight focus-visible:text-fg-on-highlight',
        'selected:bg-selected selected:text-fg-on-selected selected:hover:bg-selected-hover selected:focus-visible:bg-selected-hover',
        'drop-target:bg-accent-muted drop-target:text-fg',
        'dragging:opacity-60',
        'disabled:pointer-events-none disabled:text-fg-disabled disabled:**:text-current',
      ],
      itemContent: [
        'flex min-w-0 flex-1 items-center gap-1.5',
        '[padding-inline-start:calc((var(--tree-item-level)_-_1)_*_var(--tree-indent))]',
      ],
      chevron:
        'flex shrink-0 cursor-interactive items-center justify-center rounded-sm text-fg-muted outline-hidden',
      chevronPlaceholder: 'shrink-0',
    },
  },
  density: {
    compact: {
      slots: {
        root: 'gap-0.5 text-xs/relaxed [--tree-indent:--spacing(4)]',
        item: 'min-h-7 px-1.5 py-1 text-xs/relaxed **:[svg]:not-with-[size]:size-3.5',
        chevron: 'size-4',
        chevronPlaceholder: 'size-4',
      },
    },
    default: {
      slots: {
        root: 'gap-0.5 text-sm',
        item: 'px-1.5 py-1 text-sm **:[svg]:not-with-[size]:size-4',
        chevron: 'size-5',
        chevronPlaceholder: 'size-5',
      },
    },
    comfortable: {
      slots: {
        root: 'gap-1 text-sm [--tree-indent:--spacing(6)]',
        item: 'px-2 py-1.5 text-sm **:[svg]:not-with-[size]:size-4',
        chevron: 'size-6',
        chevronPlaceholder: 'size-6',
      },
    },
  },
  params: {
    highlight: {
      subtle: {
        slots: {
          item: 'overflow-hidden focus-visible:before:absolute focus-visible:before:inset-y-0 focus-visible:before:left-0 focus-visible:before:w-0.5 focus-visible:before:rounded-[inherit] focus-visible:before:bg-accent',
        },
        vars: {
          '--color-highlight': 'var(--neutral-300)',
          '--color-fg-on-highlight': 'var(--on-neutral-300)',
        },
      },
      accent: {
        vars: {
          '--color-highlight': 'var(--accent-500)',
          '--color-fg-on-highlight': 'var(--on-accent-500)',
        },
      },
    },
  },
})

export type TreeStyles = typeof styles

export { useStyles }
