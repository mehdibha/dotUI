import type {
  SelectProps as AriaSelectProps,
  SelectValueProps as AriaSelectValueProps,
} from "react-aria-components";
import type { ListBoxProps } from "@dotui/registry/ui/list-box";
import type { PopoverProps } from "@dotui/registry/ui/popover";

export interface SelectProps<T extends object> extends AriaSelectProps<T> {}

export interface SelectValueProps<T extends object>
  extends AriaSelectValueProps<T> {}

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

