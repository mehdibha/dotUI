import type * as DateFieldPrimitives from "react-aria-components/DateField";
import type * as GroupPrimitives from "react-aria-components/Group";
import type * as InputPrimitives from "react-aria-components/Input";
import type * as TextAreaPrimitives from "react-aria-components/TextArea";

/**
 * An input group combines an input with addons like buttons, icons, or labels.
 */
export interface InputGroupProps extends React.ComponentProps<typeof GroupPrimitives.Group> {}

/**
 * An input allows a user to input text.
 */
export interface InputProps extends React.ComponentProps<typeof InputPrimitives.Input> {}

/**
 * A textarea allows a user to input multi-line text.
 */
export interface TextAreaProps extends React.ComponentProps<typeof TextAreaPrimitives.TextArea> {}

/**
 * An addon rendered inside an `InputGroup` alongside the input.
 */
export interface InputGroupAddonProps extends React.ComponentProps<"div"> {}

/**
 * A date input groups the editable date segments within a date field.
 */
export interface DateInputProps extends Omit<DateFieldPrimitives.DateInputProps, "children"> {
	children?: DateFieldPrimitives.DateInputProps["children"];
}

/**
 * A date segment displays an individual unit of a date and time, and allows users to edit
 * the value by typing or using the arrow keys to increment and decrement.
 */
export interface DateSegmentProps extends React.ComponentProps<typeof DateFieldPrimitives.DateSegment> {}
