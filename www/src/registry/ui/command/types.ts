import type { ListBoxProps } from '@/registry/ui/list-box'
import type { SearchFieldProps } from '@/registry/ui/search-field'

/**
 * A command palette combines a search input with a list of commands, allowing
 * a user to filter and run them.
 */
export interface CommandProps extends React.ComponentProps<'div'> {
  /**
   * Collator options used to match items against the query as the user types.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator#options
   */
  filter?: Intl.CollatorOptions
}

/**
 * The search input used to filter the commands. Renders a `SearchField`.
 */
export interface CommandInputProps extends SearchFieldProps {}

/**
 * The list of commands, filtered to match the input's value. Renders a `ListBox`.
 */
export interface CommandContentProps<
  T extends object,
> extends ListBoxProps<T> {}
