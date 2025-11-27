import type {
  TimeFieldProps as AriaTimeFieldProps,
  TimeValue,
} from "react-aria-components";

/**
 * A time field allows users to enter and edit time values using a keyboard.
 * Each part of a time value is displayed in an individually editable segment.
 */
export interface TimeFieldProps<T extends TimeValue>
  extends AriaTimeFieldProps<T> {}
