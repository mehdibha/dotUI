/**
 * A row in a conversation: an optional avatar beside a content column that
 * holds the header, bubble, and footer. `align` sets which side the row sits on
 * and flows down to the content via context.
 */
export interface MessageProps extends React.ComponentProps<'div'> {
  /**
   * Which side the message sits on.
   * @default 'start'
   */
  align?: 'start' | 'end'
}

/**
 * The avatar slot for a message — compose an `Avatar` inside. Anchors to the
 * bottom of the row. Render an empty one on grouped follow-up messages to keep
 * them aligned.
 */
export interface MessageAvatarProps extends React.ComponentProps<'div'> {}

/**
 * The column beside the avatar — holds the header, bubble(s), and footer.
 */
export interface MessageContentProps extends React.ComponentProps<'div'> {}

/**
 * A line above the bubble — typically the sender's name and a timestamp.
 */
export interface MessageHeaderProps extends React.ComponentProps<'div'> {}

/**
 * A line below the bubble — status or per-message actions. Aligns to the
 * message's side.
 */
export interface MessageFooterProps extends React.ComponentProps<'div'> {}

/**
 * Groups consecutive messages from the same sender with tight spacing.
 */
export interface MessageGroupProps extends React.ComponentProps<'div'> {}
