import type {
	Header as AriaHeader,
	MenuItemProps as AriaMenuItemProps,
	MenuProps as AriaMenuProps,
	MenuSectionProps as AriaMenuSectionProps,
	MenuTriggerProps as AriaMenuTriggerProps,
	SubmenuTriggerProps as AriaSubmenuTriggerProps,
} from "react-aria-components";

/**
 * Missing description.
 */
export interface MenuProps extends AriaMenuTriggerProps {}

/**
 * A menu displays a list of actions or options that a user can choose.
 */
export interface MenuContentProps<T> extends AriaMenuProps<T> {}

/**
 * A submenu trigger is used to wrap a submenu's trigger item and the submenu itself.
 */
export interface MenuSubProps extends AriaSubmenuTriggerProps {}

/**
 * A MenuItem represents an individual action in a Menu.
 */
export interface MenuItemProps<T> extends AriaMenuItemProps<T> {
	/**
	 * The color variant of the menu item.
	 * @default 'default'
	 */
	variant?: "default" | "success" | "warning" | "accent" | "danger";
}

/**
 * A MenuSection represents a section within a Menu.
 */
export interface MenuSectionProps<T> extends AriaMenuSectionProps<T> {}

/**
 * Missing description.
 */
export interface MenuSectionHeaderProps extends React.ComponentProps<typeof AriaHeader> {}
