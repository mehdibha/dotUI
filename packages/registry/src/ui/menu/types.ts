import type {
  MenuTriggerProps as AriaMenuTriggerProps,
  MenuProps as AriaMenuProps,
  MenuItemProps as AriaMenuItemProps,
  MenuSectionProps as AriaMenuSectionProps,
  SubmenuTriggerProps as AriaSubmenuTriggerProps,
  Header as AriaHeader,
} from "react-aria-components";

export interface MenuProps extends AriaMenuTriggerProps {}

export interface MenuContentProps<T> extends AriaMenuProps<T> {}

export interface MenuSubProps extends AriaSubmenuTriggerProps {}

export interface MenuItemProps<T> extends AriaMenuItemProps<T> {
  /**
   * The color variant of the menu item.
   * @default 'default'
   */
  variant?: "default" | "success" | "warning" | "accent" | "danger";
}

export interface MenuSectionProps<T> extends AriaMenuSectionProps<T> {}

export interface MenuSectionHeaderProps
  extends React.ComponentProps<typeof AriaHeader> {}

