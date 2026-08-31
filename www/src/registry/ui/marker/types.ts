/**
 * A labeled divider row — a date in a message list, a section label in a
 * feed — rendered inline with the content it annotates.
 */
export interface MarkerProps extends React.ComponentProps<"div"> {
  /**
   * The visual treatment. `separator` centers the content between two
   * hairlines, `border` underlines the row, `default` renders the content
   * plain.
   * @default 'default'
   */
  variant?: "default" | "separator" | "border"
}

/**
 * The marker's leading icon. Hidden from assistive technology.
 */
export interface MarkerIconProps extends React.ComponentProps<"span"> {}

/**
 * The marker's text content.
 */
export interface MarkerContentProps extends React.ComponentProps<"span"> {}
