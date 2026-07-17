import { createStyles } from '@/lib/styles'

import tokenFieldMeta from './meta'

const { useStyles, styles } = createStyles(tokenFieldMeta, {
  base: {
    slots: {
      root: ['group/token-field flex w-full flex-col gap-1.5'],
      input: [
        'min-h-16 w-full rounded-(--input-radius) border border-border-field bg-field px-2.5 py-2 text-base outline-none sm:text-sm',
        'transition-[box-shadow,border-color,color]',
        'focus:border-border-focus focus:ring-2 focus:ring-border-focus-muted',
        'data-disabled:cursor-disabled data-disabled:border-border-disabled data-disabled:bg-disabled data-disabled:text-fg-disabled',
        // Placeholder for the empty contenteditable, driven by data-placeholder.
        'empty:before:pointer-events-none empty:before:text-fg-muted empty:before:content-[attr(data-placeholder)]',
      ],
      token: [
        'rounded-(--tag-radius) bg-accent-muted px-0.5 text-fg-accent',
        'data-selected:bg-accent data-selected:text-fg-on-accent',
      ],
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type TokenFieldStyles = typeof styles

export { useStyles }
