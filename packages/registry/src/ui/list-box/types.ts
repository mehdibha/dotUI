import type {
  Header as AriaHeader,
  ListBoxItemProps as AriaListBoxItemProps,
  ListBoxProps as AriaListBoxProps,
  ListBoxSectionProps as AriaListBoxSectionProps,
  VirtualizerProps as AriaVirtualizerProps,
} from "react-aria-components";

export interface ListBoxProps<T> extends AriaListBoxProps<T> {
  /**
   * Whether the list box is in a loading state.
   */
  isLoading?: boolean;
}

export interface ListBoxItemProps<T> extends AriaListBoxItemProps<T> {
  /**
   * The color variant of the list box item.
   * @default 'default'
   */
  variant?: "default" | "success" | "warning" | "danger";
}

export interface ListBoxSectionProps<T> extends AriaListBoxSectionProps<T> {}

export interface ListBoxSectionHeaderProps
  extends React.ComponentProps<typeof AriaHeader> {}

export interface ListBoxVirtualizerProps<T>
  extends Omit<AriaVirtualizerProps<T>, "layout"> {}
