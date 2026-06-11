import type * as SelectPrimitives from 'react-aria-components/Select'

import type { ListBoxProps } from '@/registry/ui/list-box'
import type { PopoverProps } from '@/registry/ui/popover'

/**
 * A select displays a collapsible list of options and allows a user to select one of them.
 */
export interface SelectProps<
  T extends object,
  M extends 'single' | 'multiple' = 'single',
> extends SelectPrimitives.SelectProps<T, M> {}

/**
 * SelectValue renders the current value of a Select, or a placeholder if no value is selected.
 * It is usually placed within the button element.
 */
export interface SelectValueProps<
  T extends object,
> extends SelectPrimitives.SelectValueProps<T> {}

/**
 * Missing description.
 */
export interface SelectContentProps<T extends object>
  extends
    ListBoxProps<T>,
    Pick<
      PopoverProps,
      'placement' | 'defaultOpen' | 'isOpen' | 'onOpenChange'
    > {
  placement?: PopoverProps['placement']

  /**
   * Whether to use virtualization for large lists.
   */
  virtulized?: boolean
}
