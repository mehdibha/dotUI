import { createStyles } from '@/lib/styles'

import flowEditorMeta from './meta'

const { useStyles, styles } = createStyles(flowEditorMeta, {
  base: {
    slots: {
      root: 'h-[420px] w-full overflow-hidden rounded-(--flow-editor-radius) border bg-bg [&_.react-flow__attribution]:hidden',
      flow: 'size-full',
    },
  },
})

export type FlowEditorStyles = typeof styles

export { useStyles }
