import { createStyles } from '@/modules/core/styles'

import accordionMeta from './meta'

const { useStyles, styles } = createStyles(accordionMeta, {
  base: {
    base: 'flex w-full flex-col',
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    style: {
      default: {
        base: '**:data-disclosure:not-last:border-b',
      },
      hammamet: {
        base: 'border **:data-disclosure:not-last:border-b',
      },
    },
  },
})

export type AccordionStyles = typeof styles

export { useStyles }
