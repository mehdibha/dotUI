/**
 * The message surface — a chat bubble. `variant` paints it; `align` sets which
 * side it hugs and which corner tightens into a tail. Compose `BubbleContent`
 * and `BubbleReactions` inside.
 */
export interface BubbleProps extends React.ComponentProps<'div'> {
  /**
   * The surface style.
   * @default 'muted'
   */
  variant?:
    | 'default'
    | 'secondary'
    | 'muted'
    | 'tinted'
    | 'outline'
    | 'ghost'
    | 'destructive'
  /**
   * Which side the bubble hugs (and which corner becomes the tail).
   * @default 'start'
   */
  align?: 'start' | 'end'
}

/**
 * The content inside a bubble. Set `asChild` to render the bubble's body as a
 * link or button instead of a div.
 */
export interface BubbleContentProps extends React.ComponentProps<'div'> {
  /**
   * Merge props onto the single child element instead of rendering a div.
   * @default false
   */
  asChild?: boolean
}

/**
 * A row of reaction chips attached to a bubble. Each child renders as a pill.
 */
export interface BubbleReactionsProps extends React.ComponentProps<'div'> {
  /**
   * Whether the reactions sit below or above the bubble content.
   * @default 'bottom'
   */
  side?: 'top' | 'bottom'
}

/**
 * Stacks consecutive bubbles from the same sender with tight spacing.
 */
export interface BubbleGroupProps extends React.ComponentProps<'div'> {}
