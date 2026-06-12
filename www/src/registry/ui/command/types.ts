import type { ListBoxProps } from '@/registry/ui/list-box'
import type { PopoverProps } from '@/registry/ui/popover'
import type { SearchFieldProps } from '@/registry/ui/search-field'

/**
 * A command palette combines a search input with a list of commands, allowing
 * a user to filter and run them.
 */
export interface CommandProps extends React.ComponentProps<'div'> {}

/**
 * The search input used to filter the commands.
 */
export interface CommandInputProps extends SearchFieldProps {
  /**
   * Placeholder text for the search input.
   */
  placeholder?: string
}

/**
 * Contains the command items, filtered to match the input's value.
 */
export interface CommandContentProps<T extends object> extends ListBoxProps<T> {
  placement?: PopoverProps['placement']

  /**
   * Whether to use virtualization for large lists.
   */
  virtulized?: boolean
}
