"use client";

import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as HeaderPrimitives from "react-aria-components/Header";
import * as MenuPrimitives from "react-aria-components/Menu";
import type * as React from "react";
import type { VariantProps } from "tailwind-variants";

import { cn } from "@/registry/lib/utils";

import { useStyles } from "./styles";
import type { MenuStyles } from "./styles";

// MARK: menuStyles

// MARK: seperator

interface MenuProps extends MenuPrimitives.MenuTriggerProps {}

const Menu = (props: MenuProps) => {
	return <MenuPrimitives.MenuTrigger {...props} />;
};

// MARK: seperator

interface MenuContentProps<T> extends MenuPrimitives.MenuProps<T> {}
const MenuContent = <T extends object>({ className, ...props }: MenuContentProps<T>) => {
	const { root } = useStyles()();
	return (
		<MenuPrimitives.Menu className={composeRenderProps(className, (className) => root({ className }))} {...props} />
	);
};

// MARK: seperator

interface MenuSubProps extends MenuPrimitives.SubmenuTriggerProps {}

const MenuSub = (props: MenuSubProps) => {
	return <MenuPrimitives.SubmenuTrigger {...props} />;
};

// MARK: seperator

interface MenuItemProps<T> extends MenuPrimitives.MenuItemProps<T>, VariantProps<MenuStyles> {}

const MenuItem = <T extends object>({ className, variant, ...props }: MenuItemProps<T>) => {
	const { item } = useStyles()();
	return (
		<MenuPrimitives.MenuItem
			data-slot="menu-item"
			className={composeRenderProps(className, (className) => item({ className, variant }))}
			{...props}
		>
			{composeRenderProps(props.children, (children, { selectionMode, isSelected, hasSubmenu }) => (
				<>
					{selectionMode !== "none" && (
						<span className="flex w-8 items-center justify-center">
							{isSelected && <CheckIcon aria-hidden className="size-4 text-fg-accent" />}
						</span>
					)}
					{children}
					{hasSubmenu && <ChevronRightIcon aria-hidden className="size-4" />}
				</>
			))}
		</MenuPrimitives.MenuItem>
	);
};

// MARK: seperator

interface MenuSectionProps<T> extends MenuPrimitives.MenuSectionProps<T> {}
const MenuSection = <T extends object>({ children, className, ...props }: MenuSectionProps<T>) => {
	const { section } = useStyles()();
	return (
		<MenuPrimitives.MenuSection className={section({ className })} {...props}>
			{children}
		</MenuPrimitives.MenuSection>
	);
};

// MARK: seperator

interface MenuSectionHeaderProps extends React.ComponentProps<typeof HeaderPrimitives.Header> {}

const MenuSectionHeader = ({ className, ...props }: MenuSectionHeaderProps) => {
	return <HeaderPrimitives.Header className={cn("font-medium text-fg-muted text-sm", className)} {...props} />;
};

// MARK: seperator

export type { MenuContentProps, MenuItemProps, MenuProps, MenuSectionHeaderProps, MenuSectionProps, MenuSubProps };
export { Menu, MenuContent, MenuItem, MenuSection, MenuSectionHeader, MenuSub };
