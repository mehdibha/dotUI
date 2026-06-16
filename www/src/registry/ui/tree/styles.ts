import { createStyles } from '@/modules/core/styles'

import treeMeta from './meta'

const { useStyles, styles } = createStyles(treeMeta, {
  base: {
    slots: {
      root: [
        'flex max-h-[inherit] flex-col gap-px overflow-auto rounded-lg border bg-bg p-1 outline-hidden',
        '[--tree-indent:--spacing(4)]',
        'data-empty:items-center data-empty:justify-center',
      ],
      item: [
        'group/tree-item relative flex w-full items-center rounded-(--tree-item-radius) outline-hidden select-none',
        '**:[svg]:pointer-events-none **:[svg]:shrink-0',
        'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-focus',
        'selected:bg-accent selected:text-fg-on-accent selected:hover:bg-accent selected:focus-visible:outline-(--color-fg-on-accent)',
        'drop-target:bg-accent-muted drop-target:text-fg',
        'dragging:opacity-60',
        'disabled:pointer-events-none disabled:text-fg-disabled disabled:**:text-current',
      ],
      itemContent: [
        'flex min-w-0 flex-1 items-center gap-1.5',
        '[padding-inline-start:calc((var(--tree-item-level)_-_1)_*_var(--tree-indent))]',
      ],
      chevron:
        'flex size-4 shrink-0 cursor-interactive items-center justify-center text-fg-muted outline-hidden',
      chevronPlaceholder: 'size-4 shrink-0',
      label: 'flex min-w-0 flex-1 items-center gap-1.5',
    },
    variants: {
      // A row is interactive when pressing it does something — it can be
      // selected, or it has children to expand. Inert rows (e.g. a leaf in a
      // non-selectable tree) keep the default cursor and no hover highlight.
      interactive: {
        true: {
          item: 'cursor-interactive hover:bg-muted',
        },
        false: {},
      },
    },
    defaultVariants: {
      interactive: false,
    },
  },
  density: {
    compact: {
      slots: {
        root: 'text-xs/relaxed [--tree-indent:--spacing(3.5)]',
        item: 'min-h-7 px-1.5 py-1 text-xs/relaxed **:[svg]:not-with-[size]:size-3.5',
      },
    },
    default: {
      slots: {
        root: 'text-sm',
        item: 'min-h-8 px-2 py-1 text-sm **:[svg]:not-with-[size]:size-4',
      },
    },
    comfortable: {
      slots: {
        root: 'text-sm [--tree-indent:--spacing(5)]',
        item: 'min-h-9 px-2 py-1.5 text-sm **:[svg]:not-with-[size]:size-4',
      },
    },
  },
})

export type TreeStyles = typeof styles

export { useStyles }
