import type {
  SelectProps as AriaSelectProps,
  SelectValueProps as AriaSelectValueProps,
} from "react-aria-components";

import type { ListBoxProps } from "@dotui/registry/ui/list-box";
import type { PopoverProps } from "@dotui/registry/ui/popover";

/**
 * A select displays a collapsible list of options and allows a user to select one of them.
 */
export interface SelectProps<T extends object> extends AriaSelectProps<T> {}

/**
 * SelectValue renders the current value of a Select, or a placeholder if no value is selected.
 * It is usually placed within the button element.
 */
export interface SelectValueProps<T extends object>
  extends AriaSelectValueProps<T> {}

/**
 * Missing description.
 */
export interface SelectContentProps<T extends object>
  extends ListBoxProps<T>,
    Pick<
      PopoverProps,
      "placement" | "defaultOpen" | "isOpen" | "onOpenChange"
    > {
  placement?: PopoverProps["placement"];

  /**
   * Whether to use virtualization for large lists.
   */
  virtulized?: boolean;
}
