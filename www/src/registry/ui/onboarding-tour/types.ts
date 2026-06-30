import type { Config, DriveStep } from 'driver.js'

import type { ButtonProps } from '@/registry/ui/button'

/**
 * Driver.js configuration shared by the hook and component, minus the `steps`
 * array, which is passed separately.
 *
 * @see https://driverjs.com/docs/configuration
 */
export type OnboardingTourOptions = Omit<Config, 'steps'>

/**
 * Imperative handle returned by `useOnboardingTour`, used to drive the tour
 * from your own controls.
 */
export interface OnboardingTourHandle {
  /** Build the driver instance (if needed) and start the tour from the first step. */
  start: () => void
  /** Move to the next step. No-op when the tour is not running. */
  next: () => void
  /** Move to the previous step. No-op when the tour is not running. */
  previous: () => void
  /** Stop the tour and clear the highlight overlay. */
  stop: () => void
  /** Whether the tour is currently running. */
  isActive: () => boolean
}

/**
 * A guided product tour built on driver.js. Highlights a sequence of elements
 * on the page, each with a coachmark popover, advancing on user interaction.
 * Renders a `Button` trigger by default; pass a render function for a custom one.
 */
export interface OnboardingTourProps extends Omit<
  ButtonProps,
  'onPress' | 'children'
> {
  /**
   * The ordered steps that make up the tour. Each step targets an element by
   * CSS selector and shows a popover with a title and description.
   */
  steps: DriveStep[]

  /**
   * Driver.js configuration, minus `steps` (e.g. `showProgress`, `allowClose`,
   * `overlayColor`).
   */
  options?: OnboardingTourOptions

  /**
   * Trigger content. A function receives the tour handle so you can render a
   * custom control (calling `start`, `next`, etc.); a node renders inside the
   * default `Button` trigger.
   *
   * @default "Start tour"
   */
  children?: React.ReactNode | ((tour: OnboardingTourHandle) => React.ReactNode)
}
