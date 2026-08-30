/**
 * A group of consecutive messages from the same sender.
 */
export interface MessageGroupProps extends React.ComponentProps<"div"> {}

/**
 * One turn in a conversation — lays out the avatar and the content column on
 * one side of the thread.
 */
export interface MessageProps extends React.ComponentProps<"div"> {
  /**
   * Which side of the conversation the message sits on. `end` flips the row,
   * putting the avatar after the content.
   * @default 'start'
   */
  align?: "start" | "end"
}

/**
 * The sender's avatar — a circular wrapper for an image, initials, or icon.
 * Anchors to the bottom of the message.
 */
export interface MessageAvatarProps extends React.ComponentProps<"div"> {}

/**
 * The message's content column — bubbles, text, or any rich content.
 */
export interface MessageContentProps extends React.ComponentProps<"div"> {}

/**
 * Metadata above the content — sender name, timestamp.
 */
export interface MessageHeaderProps extends React.ComponentProps<"div"> {}

/**
 * Metadata below the content — delivery status, reactions summary.
 */
export interface MessageFooterProps extends React.ComponentProps<"div"> {}
