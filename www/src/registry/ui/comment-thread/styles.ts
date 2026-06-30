import { createStyles } from '@/lib/styles'

import commentThreadMeta from './meta'

const { useStyles, styles } = createStyles(commentThreadMeta, {
  base: {
    slots: {
      root: 'flex flex-col gap-4 [&_[data-comment-thread]]:mt-4 [&_[data-comment-thread]]:border-l [&_[data-comment-thread]]:pl-5',
      comment: 'flex gap-3',
      content: 'flex min-w-0 flex-1 flex-col gap-1',
      header: 'flex flex-wrap items-baseline gap-x-2',
      author: 'text-sm font-medium',
      timestamp: 'text-xs text-fg-muted',
      body: 'text-sm whitespace-pre-line text-fg',
      actions: 'mt-0.5 flex items-center gap-1',
    },
  },
})

export type CommentThreadStyles = typeof styles

export { useStyles }
