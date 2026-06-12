/**
 * A badge displays a short label or status that describes an item.
 */
export interface BadgeProps extends React.ComponentProps<'span'> {
  /**
   * The visual appearance of the badge.
   * @default 'solid'
   */
  appearance?: 'solid' | 'subtle'
  /**
   * The visual style of the badge.
   * @default 'neutral'
   */
  variant?: 'neutral' | 'accent' | 'danger' | 'success' | 'warning' | 'info'
  /**
   * The size of the badge.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
}
