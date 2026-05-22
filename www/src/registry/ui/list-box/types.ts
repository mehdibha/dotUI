import type * as HeaderPrimitives from "react-aria-components/Header";
import type * as ListBoxPrimitives from "react-aria-components/ListBox";
import type * as VirtualizerPrimitives from "react-aria-components/Virtualizer";

/**
 * A listbox displays a list of options and allows a user to select one or more of them.
 */
export interface ListBoxProps<T> extends ListBoxPrimitives.ListBoxProps<T> {
	/**
	 * Whether the list box is in a loading state. Renders a `ListBoxLoader` strip
	 * directly after the items.
	 */
	isLoading?: boolean;
}

/**
 * A ListBoxItem represents an individual option in a ListBox.
 */
export interface ListBoxItemProps<T> extends ListBoxPrimitives.ListBoxItemProps<T> {
	/**
	 * The color treatment of the list box item.
	 * @default 'default'
	 */
	variant?: "default" | "danger";
}

/**
 * A ListBoxSection represents a section within a ListBox.
 */
export interface ListBoxSectionProps<T> extends ListBoxPrimitives.ListBoxSectionProps<T> {}

/**
 * Header rendered at the top of a ListBoxSection.
 */
export interface ListBoxSectionHeaderProps extends React.ComponentProps<typeof HeaderPrimitives.Header> {}

/**
 * Loader strip rendered below the items collection.
 */
export interface ListBoxLoaderProps extends React.ComponentProps<"div"> {}

/**
 * A Virtualizer renders a scrollable collection of data using customizable layouts.
 * It supports very large collections by only rendering visible items to the DOM.
 */
export interface ListBoxVirtualizerProps<T> extends Omit<VirtualizerPrimitives.VirtualizerProps<T>, "layout"> {}
