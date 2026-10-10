import type * as ButtonPrimitive from "react-aria-components/Button"
import type * as GroupPrimitive from "react-aria-components/Group"
import type * as NumberFieldPrimitives from "react-aria-components/NumberField"

/**
 * A number field allows a user to enter a number, and increment or decrement the value using stepper buttons.
 */
export interface NumberFieldProps extends React.ComponentProps<
  typeof NumberFieldPrimitives.NumberField
> {}

/**
 * A group wears the field shell and lays out the input with its steppers where the design system puts them.
 */
export interface NumberFieldGroupProps extends React.ComponentProps<
  typeof GroupPrimitive.Group
> {
  /**
   * The size of the field.
   * @default "md"
   */
  size?: "sm" | "md" | "lg"
}

/**
 * A stepper increments or decrements the value, drawn as part of the field.
 */
export interface NumberFieldStepperProps extends React.ComponentProps<
  typeof ButtonPrimitive.Button
> {}
