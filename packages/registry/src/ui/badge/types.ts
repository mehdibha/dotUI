/**
 * Missing description.
 */
export interface BadgeProps extends React.ComponentProps<"span"> {
  /**
   * The visual style of the badge.
   * @default 'default'
   */
  variant?: "default" | "danger" | "success" | "warning" | "info";
}
