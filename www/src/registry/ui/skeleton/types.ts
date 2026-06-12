/**
 * A skeleton displays a placeholder preview of content before it loads. It can render as a standalone shape or wrap existing content, showing matching elements as placeholders while loading.
 */
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to show the skeleton loading state.
   */
  isLoading?: boolean
}
