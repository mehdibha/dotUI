import { Link as RouterLink } from "@tanstack/react-router";
import type { ToOptions } from "@tanstack/react-router";

import { MenuItem as MenuItemPrimitive } from "./base";

import type { MenuItemProps as BaseMenuItemProps } from "./base";

export { Menu, MenuContent, MenuItemDescription, MenuItemLabel, MenuSection, MenuSectionHeader, MenuSub } from "./base";
export type {
	MenuContentProps,
	MenuItemDescriptionProps,
	MenuItemLabelProps,
	MenuProps,
	MenuSectionHeaderProps,
	MenuSectionProps,
	MenuSubProps,
} from "./base";

type MenuItemProps<T> = Omit<BaseMenuItemProps<T>, "href"> & { href?: string | ToOptions };

function MenuItem<T extends object>({ href, ...props }: MenuItemProps<T>) {
	return (
		<MenuItemPrimitive
			href={href == null ? undefined : typeof href === "object" ? href.to : href}
			render={(domProps) => {
				if (!("href" in domProps)) {
					return <div {...domProps} />;
				}
				if (typeof href === "object") {
					return <RouterLink {...href} {...domProps} />;
				}
				return <a {...domProps} />;
			}}
			{...props}
		/>
	);
}

export type { MenuItemProps };
export { MenuItem };
