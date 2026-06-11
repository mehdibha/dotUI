import type * as React from 'react'
import type { OTPFieldPreview as OTPFieldPrimitive } from '@base-ui/react/otp-field'

/**
 * An OTP field lets users enter a one-time passcode across multiple single-character inputs.
 */
export interface OTPFieldProps extends Omit<
  OTPFieldPrimitive.Root.Props,
  'disabled' | 'readOnly' | 'required' | 'onValueChange'
> {
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

export interface OTPFieldSeparatorProps extends React.ComponentProps<
  typeof OTPFieldPrimitive.Separator
> {}
