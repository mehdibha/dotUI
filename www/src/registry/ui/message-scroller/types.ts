/**
 * Owns the scroll state for a transcript: stick-to-bottom while replies stream,
 * release on scroll-up, jump-to-message, and visibility tracking. Wrap the
 * `MessageScroller` in it.
 */
export interface MessageScrollerProviderProps {
  /**
   * Follow new output by pinning to the bottom while already at the bottom.
   * @default true
   */
  autoScroll?: boolean
  children?: React.ReactNode
}

/**
 * The styled frame around the viewport and controls. Needs a height-constrained
 * parent.
 */
export interface MessageScrollerProps extends React.ComponentProps<'div'> {}

/**
 * The scrollable element that preserves position and drives anchoring.
 */
export interface MessageScrollerViewportProps extends React.ComponentProps<'div'> {}

/**
 * The transcript container — a polite live region by default.
 */
export interface MessageScrollerContentProps extends React.ComponentProps<'div'> {}

/**
 * Wraps a single row for measurement and addressing.
 */
export interface MessageScrollerItemProps extends React.ComponentProps<'div'> {
  /** Stable id used by jump-to-message. */
  messageId?: string
  /** Marks a turn boundary (typically the user's message). */
  scrollAnchor?: boolean
}

/**
 * Scrolls the transcript to the latest message. Hidden while at the bottom.
 * Renders nothing outside a `MessageScrollerProvider`.
 */
export interface MessageScrollerButtonProps extends React.ComponentProps<'button'> {}
