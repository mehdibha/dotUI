import { createStyles } from '@/lib/styles'

import markerMeta from './meta'

const { useStyles, styles } = createStyles(markerMeta, {
  base: {
    slots: {
      root: 'flex w-full items-center gap-2 py-1.5 text-xs text-fg-muted select-none',
      icon: 'flex shrink-0 items-center justify-center *:[svg]:size-4',
      content: 'min-w-0',
      shimmer:
        'min-w-0 animate-[dotui-marker-shimmer_2.5s_linear_infinite] [background-image:linear-gradient(100deg,var(--color-fg-muted)_35%,var(--color-fg)_50%,var(--color-fg-muted)_65%)] [background-size:200%_100%] bg-clip-text text-transparent motion-reduce:animate-none motion-reduce:text-fg-muted',
    },
    variants: {
      variant: {
        // An inline marker for status, notes, and actions.
        default: { root: '' },
        // A row boundary with a bottom border.
        border: { root: 'border-b border-border pb-2.5' },
        // A centered label with divider lines on each side.
        separator: {
          root: 'justify-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border',
        },
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
  density: {
    compact: { slots: { root: 'py-1 text-[0.6875rem]' } },
    default: { slots: { root: 'py-1.5 text-xs' } },
    comfortable: { slots: { root: 'py-2 text-xs' } },
  },
})

export type MarkerStyles = typeof styles

export { useStyles }
