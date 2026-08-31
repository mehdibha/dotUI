import type { MessageScroller as MessageScrollerPrimitive } from "@shadcn/react/message-scroller"

/**
 * Holds the scroller's state — autoscroll behavior, the default scroll
 * position, and edge thresholds. Wrap it around the scroller and anything
 * that calls its hooks.
 */
export interface MessageScrollerProviderProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Provider
> {}

/**
 * A message list that sticks to the newest message — it follows new content
 * while the reader is at the edge and stays put once they scroll away.
 */
export interface MessageScrollerProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Root
> {}

/**
 * The scrollable area of the scroller.
 */
export interface MessageScrollerViewportProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Viewport
> {}

/**
 * Lays out the messages inside the viewport.
 */
export interface MessageScrollerContentProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Content
> {}

/**
 * Wraps one message. Rendered lazily as it nears the viewport, and usable as
 * a scroll anchor.
 */
export interface MessageScrollerItemProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Item
> {}

/**
 * The scroll-to-edge button. Appears once the reader scrolls away from the
 * edge it points at, and hides again at the edge.
 */
export interface MessageScrollerButtonProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Button
> {}
