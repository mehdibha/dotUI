import type * as CalendarPrimitives from "react-aria-components/Calendar";
import type * as DateFieldPrimitives from "react-aria-components/DateField";

/**
 * A date field allows users to enter and edit date and time values using a keyboard.
 * Each part of a date value is displayed in an individually editable segment.
 */
export interface DateFieldProps<T extends CalendarPrimitives.DateValue> extends DateFieldPrimitives.DateFieldProps<T> {}
