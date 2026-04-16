import * as DateFieldPrimitives from "react-aria-components/DateField";
import * as GroupPrimitives from "react-aria-components/Group";
import * as InputPrimitives from "react-aria-components/Input";
import * as TextAreaPrimitives from "react-aria-components/TextArea";

/**
 * Missing description.
 */
export interface InputGroupProps extends React.ComponentProps<typeof GroupPrimitives.Group> {
	/**
	 * The size of the input group.
	 * @default 'md'
	 */
	size?: "sm" | "md" | "lg";
}

/**
 * An input allows a user to input text.
 */
export interface InputProps extends Omit<React.ComponentProps<typeof InputPrimitives.Input>, "size"> {
	/**
	 * The size of the input.
	 * @default 'md'
	 */
	size?: "sm" | "md" | "lg";
}

/**
 * A textarea allows a user to input multi-line text.
 */
export interface TextAreaProps extends Omit<React.ComponentProps<typeof TextAreaPrimitives.TextArea>, "size"> {
	/**
	 * The size of the textarea.
	 * @default 'md'
	 */
	size?: "sm" | "md" | "lg";
}

/**
 * Missing description.
 */
export interface InputAddonProps extends React.ComponentProps<"div"> {}

/**
 * A date input groups the editable date segments within a date field.
 */
export interface DateInputProps extends Omit<DateFieldPrimitives.DateInputProps, "children"> {
	/**
	 * The size of the date input.
	 * @default 'md'
	 */
	size?: "sm" | "md" | "lg";

	children?: DateFieldPrimitives.DateInputProps["children"];
}

/**
 * A date segment displays an individual unit of a date and time, and allows users to edit
 * the value by typing or using the arrow keys to increment and decrement.
 */
export interface DateSegmentProps extends React.ComponentProps<typeof DateFieldPrimitives.DateSegment> {}
