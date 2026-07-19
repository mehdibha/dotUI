import { createStyles } from '@/lib/styles'

import mentionMeta from './meta'

const { useStyles, styles } = createStyles(mentionMeta, {
  base: {
    slots: {
      root: ['group/mention'],
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
})

export type MentionStyles = typeof styles

export { useStyles }
