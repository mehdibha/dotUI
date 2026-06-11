import { fieldStyles } from '@/registry/ui/field'
import { createStyles } from '@/modules/core/styles'

import progressBarMeta from './meta'

const { useStyles, styles } = createStyles(progressBarMeta, {
  base: {
    slots: {
      root: fieldStyles().field(),
      // Fall back to the meta param defaults (track-size, track-radius, fill-color)
      // so the bar stays visible even when the design system hasn't injected those
      // CSS vars — otherwise the track collapses to 0 height and the fill is transparent.
      track:
        'relative flex h-[var(--progress-track-size,calc(var(--spacing)*1))] w-full items-center overflow-x-hidden rounded-[var(--progress-track-radius,9999px)] bg-muted',
      fill: 'data-indeterminate:animate-progress-indeterminate h-full w-full origin-left bg-[var(--progress-fill-color,var(--color-primary))] transition-all',
      output: 'ml-auto text-fg-muted tabular-nums',
    },
    variants: {},
    defaultVariants: {},
  },
  density: {
    compact: {
      slots: {
        output: 'text-xs',
      },
    },
    default: {
      slots: {
        output: 'text-sm',
      },
    },
    comfortable: {
      slots: {
        output: 'text-sm',
      },
    },
  },
})

export type ProgressBarStyles = typeof styles

export { useStyles }
