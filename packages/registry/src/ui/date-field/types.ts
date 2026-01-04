import type { DateFieldProps as AriaDateFieldProps, DateValue } from "react-aria-components";

/**
 * A date field allows users to enter and edit date and time values using a keyboard.
 * Each part of a date value is displayed in an individually editable segment.
 */
export interface DateFieldProps<T extends DateValue> extends AriaDateFieldProps<T> {}
