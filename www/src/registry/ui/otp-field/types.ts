import type * as React from 'react'
import type { OTPFieldPreview as OTPFieldPrimitive } from '@base-ui/react/otp-field'
import type { StyleRenderProps } from 'react-aria-components'

/**
 * Shared `className`/`style` for Base UI parts: a string/object, or a function
 * that receives the part's state — matching the React Aria render-prop form.
 */
interface BaseUIRenderStyles<State> {
  /** The CSS [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element. A function may be provided to compute the class based on component state. */
  className?: StyleRenderProps<State>['className']
  /** The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) for the element. A function may be provided to compute the style based on component state. */
  style?: StyleRenderProps<State>['style']
}

/**
 * An OTP field lets users enter a one-time passcode across multiple single-character inputs.
 */
export interface OTPFieldProps
  extends
    Omit<
      OTPFieldPrimitive.Root.Props,
      | 'disabled'
      | 'readOnly'
      | 'required'
      | 'onValueChange'
      | 'className'
      | 'style'
      | 'render'
    >,
    BaseUIRenderStyles<OTPFieldPrimitive.Root.State> {
  /** Whether the field is disabled. */
  isDisabled?: boolean
  /** Whether the current value is invalid. */
  isInvalid?: boolean
  /** Whether the field is read only. */
  isReadOnly?: boolean
  /** Whether the field must be filled before form submission. */
  isRequired?: boolean
  /** Handler that is called when the OTP value changes. */
  onChange?: (value: string) => void
}

/**
 * A separator visually divides groups of inputs within the OTP field.
 */
export interface OTPFieldSeparatorProps
  extends
    Omit<
      React.ComponentProps<typeof OTPFieldPrimitive.Separator>,
      'className' | 'style' | 'render'
    >,
    BaseUIRenderStyles<OTPFieldPrimitive.Separator.State> {}
