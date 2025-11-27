import type { ProgressBar as AriaProgressBar } from "react-aria-components";

/**
 * Progress bars show either determinate or indeterminate progress of an operation over time.
 */
export interface ProgressBarProps
  extends React.ComponentProps<typeof AriaProgressBar> {}

/**
 * Missing description.
 */
export interface ProgressBarControlProps extends React.ComponentProps<"div"> {
  /**
   * The color variant of the progress bar.
   * @default 'accent'
   */
  variant?: "primary" | "accent" | "warning" | "danger" | "success";

  /**
   * The size of the progress bar.
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";

  /**
   * Duration of the progress animation.
   */
  duration?: `${number}s` | `${number}ms`;
}

/**
 * Missing description.
 */
export interface ProgressBarValueLabelProps
  extends React.ComponentProps<"span"> {}
