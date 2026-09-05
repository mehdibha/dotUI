import type * as GroupPrimitive from "react-aria-components/Group"
import type * as NumberFieldPrimitives from "react-aria-components/NumberField"

/**
 * A number field allows a user to enter a number, and increment or decrement the value using stepper buttons.
 */
export interface NumberFieldProps extends React.ComponentProps<
  typeof NumberFieldPrimitives.NumberField
> {}

/**
 * A group lays out the input and its stepper buttons as the design system's steppers.
 */
export interface NumberFieldGroupProps extends React.ComponentProps<
  typeof GroupPrimitive.Group
> {}
