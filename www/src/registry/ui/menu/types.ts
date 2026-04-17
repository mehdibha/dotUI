import type * as HeaderPrimitives from "react-aria-components/Header";
import type * as MenuPrimitives from "react-aria-components/Menu";

/**
 * Missing description.
 */
export interface MenuProps extends MenuPrimitives.MenuTriggerProps {}

/**
 * A menu displays a list of actions or options that a user can choose.
 */
export interface MenuContentProps<T> extends MenuPrimitives.MenuProps<T> {}

/**
 * A submenu trigger is used to wrap a submenu's trigger item and the submenu itself.
 */
export interface MenuSubProps extends MenuPrimitives.SubmenuTriggerProps {}

/**
 * A MenuItem represents an individual action in a Menu.
 */
export interface MenuItemProps<T> extends MenuPrimitives.MenuItemProps<T> {
	/**
	 * The color variant of the menu item.
	 * @default 'default'
	 */
	variant?: "default" | "success" | "warning" | "accent" | "danger";
}

/**
 * A MenuSection represents a section within a Menu.
 */
export interface MenuSectionProps<T> extends MenuPrimitives.MenuSectionProps<T> {}

/**
 * Missing description.
 */
export interface MenuSectionHeaderProps extends React.ComponentProps<typeof HeaderPrimitives.Header> {}
