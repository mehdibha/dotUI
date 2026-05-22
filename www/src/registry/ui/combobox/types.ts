import type * as ComboBoxPrimitives from "react-aria-components/ComboBox";

/**
 * A combo box combines a text input with a listbox, allowing users to filter
 * a list of options to items matching a query.
 */
export interface ComboboxProps<
	T extends object,
	M extends "single" | "multiple" = "single",
> extends ComboBoxPrimitives.ComboBoxProps<T, M> {}

/**
 * Renders the current value of a Combobox, or a placeholder if no value is selected.
 * Supports a render prop for custom rendering of the selected item(s) — useful for
 * multi-select with tags.
 */
export interface ComboboxValueProps<T extends object> extends ComboBoxPrimitives.ComboBoxValueProps<T> {}
