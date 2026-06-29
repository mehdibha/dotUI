/**
 * A scrolling conversation container that keeps the view pinned to the latest
 * message while new content streams in, and reveals a scroll-to-bottom control
 * once the reader scrolls away. Edges fade as content overflows.
 */
export interface ConversationProps extends React.ComponentProps<'div'> {}

/**
 * The scrollable region that holds the messages. Place `Message`s and
 * `ConversationEmptyState` inside it.
 */
export interface ConversationContentProps extends React.ComponentProps<'div'> {}

/**
 * A floating control that scrolls the conversation to the latest message.
 * Hidden while already at the bottom; reveals itself when the reader scrolls up.
 * Renders nothing unless inside a `Conversation`.
 */
export interface ConversationScrollButtonProps extends React.ComponentProps<'button'> {}

/**
 * A centered placeholder for an empty conversation — an icon, a title, and a
 * short description.
 */
export interface ConversationEmptyStateProps extends Omit<
  React.ComponentProps<'div'>,
  'title'
> {
  /** Leading icon, rendered in a muted circle. */
  icon?: React.ReactNode
  /** Primary line. */
  title?: React.ReactNode
  /** Secondary, muted line. */
  description?: React.ReactNode
}
