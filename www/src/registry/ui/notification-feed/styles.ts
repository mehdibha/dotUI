import { createStyles } from '@/lib/styles'

import notificationFeedMeta from './meta'

const { useStyles, styles } = createStyles(notificationFeedMeta, {
  base: {
    slots: {
      root: 'flex w-full flex-col divide-y overflow-hidden rounded-(--notification-feed-radius) border bg-card',
      item: 'relative flex gap-3 p-3 transition-colors hover:bg-muted/50 data-[unread]:bg-muted/40 data-[unread]:before:absolute data-[unread]:before:inset-y-0 data-[unread]:before:left-0 data-[unread]:before:w-0.5 data-[unread]:before:bg-primary',
      content: 'flex min-w-0 flex-1 flex-col gap-0.5',
      title: 'text-sm [&_b]:font-medium [&_strong]:font-medium',
      description: 'text-sm text-fg-muted',
      time: 'text-xs text-fg-muted',
      actions: 'mt-1.5 flex items-center gap-2',
    },
  },
})

export type NotificationFeedStyles = typeof styles

export { useStyles }
