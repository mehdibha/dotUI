import { createStyles } from '@/lib/styles'

import checkboxGroupMeta from './meta'

const { useStyles, styles } = createStyles(checkboxGroupMeta, {
  base: {
    base: 'flex flex-col gap-3',
  },
})

export type CheckboxGroupStyles = typeof styles

export { useStyles }
