import { createStyles } from '@/modules/core/styles'

import linkMeta from './meta'

const { useStyles, styles } = createStyles(linkMeta, {
  base: {
    base: [
      'focus-reset focus-visible:focus-ring',
      'inline-flex items-center gap-1 transition-colors disabled:text-fg-disabled',
    ],
    variants: {
      variant: {
        accent: 'text-fg-accent',
        quiet: 'font-medium text-fg underline underline-offset-2',
        unstyled: '',
      },
    },
    defaultVariants: {
      variant: 'accent',
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type LinkStyles = typeof styles

export { useStyles }
