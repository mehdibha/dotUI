import type * as ProgressBarPrimitives from "react-aria-components/ProgressBar";

/**
 * Progress bars show either determinate or indeterminate progress of an operation over time.
 */
export interface ProgressBarProps extends React.ComponentProps<typeof ProgressBarPrimitives.ProgressBar> {}

/**
 * The visual track for the progress bar.
 */
export interface ProgressBarControlProps extends React.ComponentProps<"div"> {}

/**
 * Missing description.
 */
export interface ProgressBarOutputProps extends React.ComponentProps<"span"> {}
