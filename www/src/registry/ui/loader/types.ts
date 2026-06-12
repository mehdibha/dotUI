import type * as ProgressBarPrimitives from 'react-aria-components/ProgressBar'

/**
 * A loader displays an animated spinner that indicates an operation is in progress.
 */
export interface LoaderProps extends ProgressBarPrimitives.ProgressBarProps {
  /**
   * The size of the loader in pixels.
   * @default 20
   */
  size?: number

  /**
   * The stroke width of the loader circle.
   * @default 2
   */
  stroke?: number

  /**
   * The animation speed in seconds.
   * @default 0.8
   */
  speed?: number

  /**
   * The length of the stroke as a percentage (0-1).
   * @default 0.25
   */
  strokeLength?: number
}
