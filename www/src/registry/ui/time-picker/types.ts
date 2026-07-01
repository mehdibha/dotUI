import type React from 'react'
import type * as TimeFieldPrimitive from 'react-aria-components/TimeField'

/**
 * A time picker combines a TimeField and a scrollable time-column popover to
 * allow users to enter or select a time value.
 */
export interface TimePickerProps<
  T extends TimeFieldPrimitive.TimeValue,
> extends Omit<TimeFieldPrimitive.TimeFieldProps<T>, 'className' | 'children'> {
  className?: string
  children?: React.ReactNode
  /** Whether the popover is open by default (uncontrolled). */
  defaultOpen?: boolean
  /** Whether the popover is open (controlled). */
  isOpen?: boolean
  /** Handler that is called when the popover's open state changes. */
  onOpenChange?: (isOpen: boolean) => void
}

/**
 * The scrollable hour / minute / second / day-period columns rendered inside a
 * TimePicker popover. Reads and writes the value from the enclosing TimePicker.
 */
export interface TimePickerColumnsProps extends React.ComponentProps<'div'> {}
