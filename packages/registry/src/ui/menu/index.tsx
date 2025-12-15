"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type {
	MenuContentProps,
	MenuItemProps,
	MenuProps,
	MenuSectionHeaderProps,
	MenuSectionProps,
	MenuSubProps,
} from "./types";

export const Menu = createDynamicComponent<MenuProps>("menu", "Menu", Default.Menu, {});

export const MenuContent = <T extends object = object>(props: MenuContentProps<T>) => {
	const Component = createDynamicComponent<MenuContentProps<T>>("menu", "MenuContent", Default.MenuContent, {});

	return <Component {...props} />;
};

export const MenuItem = <T extends object = object>(props: MenuItemProps<T>) => {
	const Component = createDynamicComponent<MenuItemProps<T>>("menu", "MenuItem", Default.MenuItem, {});

	return <Component {...props} />;
};

export const MenuSection = <T extends object = object>(props: MenuSectionProps<T>) => {
	const Component = createDynamicComponent<MenuSectionProps<T>>("menu", "MenuSection", Default.MenuSection, {});

	return <Component {...props} />;
};

export const MenuSectionHeader = createDynamicComponent<MenuSectionHeaderProps>(
	"menu",
	"MenuSectionHeader",
	Default.MenuSectionHeader,
	{},
);

export const MenuSub = createDynamicComponent<MenuSubProps>("menu", "MenuSub", Default.MenuSub, {});
