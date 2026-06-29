/**
 * A row in a conversation: an optional avatar alongside a body that holds the
 * header, bubble, and actions. The `from` author flows down to children via
 * context, driving alignment and bubble color.
 */
export interface MessageProps extends React.ComponentProps<'div'> {
  /**
   * Who sent the message. Sets row alignment and is inherited by the bubble,
   * avatar, and actions.
   * @default 'assistant'
   */
  from?: 'user' | 'assistant'
}

/**
 * The avatar shown next to a message. Renders a fallback from `name`'s initials
 * and, when `src` loads, the image on top.
 */
export interface MessageAvatarProps extends React.ComponentProps<'span'> {
  /** Image URL for the sender's avatar. */
  src?: string
  /** Sender name — its initials are used as the fallback. */
  name?: string
}

/**
 * The wrapper around a message's header, bubble, and actions. Rarely needed
 * directly; `Message` renders it for you.
 */
export interface MessageBodyProps extends React.ComponentProps<'div'> {}

/**
 * A small header line above the bubble — typically the sender's name and a
 * timestamp.
 */
export interface MessageHeaderProps extends React.ComponentProps<'div'> {}

/**
 * The message surface. Color and the tightened tail corner come from `from`
 * (inherited from `Message`, or set explicitly when used standalone).
 */
export interface MessageBubbleProps extends React.ComponentProps<'div'> {
  /**
   * Override the inherited author for this bubble.
   * @default inherited from `Message`
   */
  from?: 'user' | 'assistant'
}

/**
 * A row of per-message controls (copy, retry, feedback…) revealed on hover or
 * focus of the message.
 */
export interface MessageActionsProps extends React.ComponentProps<'div'> {}

/**
 * Groups consecutive messages from the same author with tighter spacing.
 */
export interface MessageGroupProps extends React.ComponentProps<'div'> {}

/**
 * A centered row between turns: a labeled separator, a system note, or a live
 * streaming status with a shimmering label.
 */
export interface MessageMarkerProps extends React.ComponentProps<'div'> {
  /**
   * Marker style.
   * - `separator`: a label centered between two hairlines (e.g. a date break).
   * - `note`: a pill-shaped system note.
   * - `status`: a left-aligned live status whose label shimmers.
   * @default 'separator'
   */
  variant?: 'separator' | 'note' | 'status'
}

/**
 * A file or image attachment card rendered inside a message.
 */
export interface MessageAttachmentProps extends React.ComponentProps<'div'> {
  /** File name. */
  name: string
  /** Human-readable size or secondary label (e.g. "2.4 MB", "PDF"). */
  meta?: string
  /** Image URL — when set, a thumbnail replaces the file icon. */
  src?: string
}
