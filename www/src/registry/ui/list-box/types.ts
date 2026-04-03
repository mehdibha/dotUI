import type {
	Header as AriaHeader,
	ListBoxItemProps as AriaListBoxItemProps,
	ListBoxProps as AriaListBoxProps,
	ListBoxSectionProps as AriaListBoxSectionProps,
	VirtualizerProps as AriaVirtualizerProps,
} from "react-aria-components";

/**
 * A listbox displays a list of options and allows a user to select one or more of them.
 */
export interface ListBoxProps<T> extends AriaListBoxProps<T> {
	/**
	 * Whether the list box is in a loading state.
	 */
	isLoading?: boolean;
}

/**
 * A ListBoxItem represents an individual option in a ListBox.
 */
export interface ListBoxItemProps<T> extends AriaListBoxItemProps<T> {
	/**
	 * The color variant of the list box item.
	 * @default 'default'
	 */
	variant?: "default" | "success" | "warning" | "danger";
}

/**
 * A ListBoxSection represents a section within a ListBox.
 */
export interface ListBoxSectionProps<T> extends AriaListBoxSectionProps<T> {}

/**
 * Missing description.
 */
export interface ListBoxSectionHeaderProps extends React.ComponentProps<typeof AriaHeader> {}

/**
 * A Virtualizer renders a scrollable collection of data using customizable layouts.
 * It supports very large collections by only rendering visible items to the DOM.
 */
export interface ListBoxVirtualizerProps<T> extends Omit<AriaVirtualizerProps<T>, "layout"> {}
