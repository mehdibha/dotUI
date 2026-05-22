import type { ListBoxProps } from "@/registry/ui/list-box";
import type { PopoverProps } from "@/registry/ui/popover";
import type { SearchFieldProps } from "@/registry/ui/search-field";

/**
 * Missing description.
 */
export interface CommandProps extends React.ComponentProps<"div"> {}

/**
 * Missing description.
 */
export interface CommandInputProps extends SearchFieldProps {
	/**
	 * Placeholder text for the search input.
	 */
	placeholder?: string;
}

/**
 * Missing description.
 */
export interface CommandContentProps<T extends object> extends ListBoxProps<T> {
	placement?: PopoverProps["placement"];

	/**
	 * Whether to use virtualization for large lists.
	 */
	virtulized?: boolean;
}
