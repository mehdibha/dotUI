/**
 * A centered row between turns: a status update, a system note, or a labeled
 * separator. Compose `MarkerIcon` and `MarkerContent` inside. Set `role="status"`
 * for live streaming markers.
 */
export interface MarkerProps extends React.ComponentProps<'div'> {
  /**
   * Marker layout.
   * - `default`: an inline row for status, notes, and actions.
   * - `border`: a row boundary with a bottom border.
   * - `separator`: a centered label with divider lines on each side.
   * @default 'default'
   */
  variant?: 'default' | 'border' | 'separator'
  /**
   * Merge props onto the single child element (e.g. a link or button) instead
   * of rendering a div.
   * @default false
   */
  asChild?: boolean
}

/**
 * A decorative icon slot for a marker. Hidden from assistive technology.
 */
export interface MarkerIconProps extends React.ComponentProps<'span'> {}

/**
 * The label of a marker. Set `shimmer` to animate it for live streaming text.
 */
export interface MarkerContentProps extends React.ComponentProps<'span'> {
  /**
   * Animate the label with a shimmer — for "Thinking…" / "Generating…".
   * @default false
   */
  shimmer?: boolean
}
