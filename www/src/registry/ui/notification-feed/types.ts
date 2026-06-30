import type { ComponentProps } from 'react'

/**
 * A notification feed / inbox — a composable list of activity items. Compose
 * `Notification`s inside, each with `NotificationContent` (title, description,
 * time) and optional `NotificationActions`. Reuses `Avatar` for actor avatars.
 */
export interface NotificationFeedProps extends ComponentProps<'div'> {}

/** A single notification row. */
export interface NotificationProps extends ComponentProps<'div'> {
  /** Highlight the row as unread (accent bar + tinted background). */
  unread?: boolean
}
