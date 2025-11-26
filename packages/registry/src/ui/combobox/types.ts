import type { ComboBoxProps as AriaComboboxProps } from "react-aria-components";

import type { InputGroupProps } from "@dotui/registry/ui/input";
import type { ListBoxProps } from "@dotui/registry/ui/list-box";
import type { PopoverProps } from "@dotui/registry/ui/popover";

export interface ComboboxProps<T extends object>
  extends Omit<AriaComboboxProps<T>, "className"> {
  className?: string;
}

export interface ComboboxInputProps extends InputGroupProps {
  /**
   * Placeholder text for the input.
   */
  placeholder?: string;
}

export interface ComboboxContentProps<T extends object>
  extends ListBoxProps<T>,
    Pick<
      PopoverProps,
      "placement" | "defaultOpen" | "isOpen" | "onOpenChange"
    > {
  /**
   * Whether to use virtualization for large lists.
   */
  virtulized?: boolean;
}
