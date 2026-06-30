import type { ComponentProps } from 'react'

/**
 * A stepper communicates a user's progress through a numbered sequence of
 * steps. Composable: place `StepperItem`s inside, each with `StepperIndicator`,
 * optional `StepperTitle`/`StepperDescription`, and a `StepperSeparator`.
 */
export interface StepperProps extends ComponentProps<'div'> {
  /**
   * The index (0-based) of the active step. Earlier steps render as completed,
   * later steps as inactive.
   * @default 0
   */
  activeStep?: number
}

/** A single step within a `Stepper`. */
export interface StepperItemProps extends ComponentProps<'div'> {
  /** This step's index (0-based), compared against the stepper's `activeStep`. */
  step: number
}
