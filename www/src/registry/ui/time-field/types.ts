import * as TimeFieldPrimitives from "react-aria-components/TimeField";

/**
 * A time field allows users to enter and edit time values using a keyboard.
 * Each part of a time value is displayed in an individually editable segment.
 */
export interface TimeFieldProps<T extends TimeFieldPrimitives.TimeValue> extends TimeFieldPrimitives.TimeFieldProps<T> {}
