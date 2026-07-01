import { createStyles } from '@/lib/styles'

import bubbleMeta from './meta'

const { useStyles, styles } = createStyles(bubbleMeta, {
  base: {
    slots: {
      // The message surface. `variant` paints it, `align` sets which side it
      // hugs and which corner tightens into a tail.
      root: [
        'flex w-fit max-w-full flex-col rounded-(--bubble-radius) px-3.5 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap',
        '[&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2',
        '[&_:where(p):not(:first-child)]:mt-2',
      ],
      content: '',
      // Reaction chips — children render as small pills hugging the surface.
      reactions: [
        'mt-1 flex flex-wrap gap-1',
        '*:inline-flex *:items-center *:gap-0.5 *:rounded-full *:border *:bg-bg *:px-1.5 *:py-0.5 *:text-xs *:leading-none *:text-fg',
      ],
      group: 'flex flex-col gap-1',
    },
    variants: {
      variant: {
        default: { root: 'bg-primary text-fg-on-primary' },
        secondary: { root: 'bg-neutral text-fg-on-neutral' },
        muted: { root: 'bg-muted text-fg' },
        tinted: {
          root: 'bg-[color-mix(in_oklch,var(--color-accent)_18%,var(--color-bg))] text-fg-accent',
        },
        outline: { root: 'border bg-transparent text-fg' },
        ghost: { root: 'bg-transparent text-fg' },
        destructive: { root: 'bg-danger text-fg-on-danger' },
      },
      align: {
        start: { root: 'mr-auto rounded-bl-sm' },
        end: { root: 'ml-auto rounded-br-sm' },
      },
    },
    defaultVariants: {
      variant: 'muted',
      align: 'start',
    },
  },
  density: {
    compact: { slots: { root: 'px-3 py-1.5 text-xs' } },
    default: { slots: { root: 'px-3.5 py-2 text-sm' } },
    comfortable: { slots: { root: 'px-4 py-2.5 text-sm' } },
  },
})

export type BubbleStyles = typeof styles

export { useStyles }
