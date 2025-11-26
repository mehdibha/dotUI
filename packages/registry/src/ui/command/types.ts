import type { ListBoxProps } from "@dotui/registry/ui/list-box";
import type { PopoverProps } from "@dotui/registry/ui/popover";
import type { SearchFieldProps } from "@dotui/registry/ui/search-field";

export interface CommandProps extends React.ComponentProps<"div"> {}

export interface CommandInputProps extends SearchFieldProps {
  /**
   * Placeholder text for the search input.
   */
  placeholder?: string;
}

export interface CommandContentProps<T extends object> extends ListBoxProps<T> {
  placement?: PopoverProps["placement"];

  /**
   * Whether to use virtualization for large lists.
   */
  virtulized?: boolean;
}

