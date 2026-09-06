/**
 * A badge displays a short label or status that describes an item.
 */
export interface BadgeProps extends React.ComponentProps<"span"> {
  /**
   * The visual appearance of the badge. Defaults to the design system's badge style.
   * @default 'solid'
   */
  appearance?: "solid" | "soft" | "outline" | "soft-outline"
  /**
   * The visual style of the badge.
   * @default 'neutral'
   */
  variant?: "neutral" | "accent" | "danger" | "success" | "warning" | "info"
  /**
   * The size of the badge.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg"
}
