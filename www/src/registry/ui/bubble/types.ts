/**
 * A group of consecutive bubbles from the same sender, stacked with a tight
 * gap.
 */
export interface BubbleGroupProps extends React.ComponentProps<"div"> {}

/**
 * A chat bubble — positions its content, reactions and metadata on one side
 * of the conversation.
 */
export interface BubbleProps extends React.ComponentProps<"div"> {
  /**
   * The visual style of the bubble's content.
   * @default 'primary'
   */
  variant?:
    | "primary"
    | "neutral"
    | "muted"
    | "tinted"
    | "outline"
    | "ghost"
    | "danger"

  /**
   * Which side of the conversation the bubble sits on.
   * @default 'start'
   */
  align?: "start" | "end"
}

/**
 * The bubble's body — the contained surface the variant styles.
 */
export interface BubbleContentProps extends React.ComponentProps<"div"> {}

/**
 * Emoji reactions pinned to a corner of the bubble.
 */
export interface BubbleReactionsProps extends React.ComponentProps<"div"> {
  /**
   * The bubble edge the reactions attach to.
   * @default 'bottom'
   */
  side?: "top" | "bottom"

  /**
   * The corner of that edge the reactions align with.
   * @default 'end'
   */
  align?: "start" | "end"
}
