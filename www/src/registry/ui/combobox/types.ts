import type * as ComboBoxPrimitives from "react-aria-components/ComboBox";

/**
 * A combo box combines a text input with a listbox, allowing users to filter
 * a list of options to items matching a query.
 */
export interface ComboboxProps<T extends object> extends Omit<ComboBoxPrimitives.ComboBoxProps<T>, "className"> {
	className?: string;
}
