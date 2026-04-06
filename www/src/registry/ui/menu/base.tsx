"use client";

import { CheckIcon, ChevronRightIcon } from "lucide-react";
import {
	Header as AriaHeader,
	Menu as AriaMenu,
	MenuItem as AriaMenuItem,
	MenuSection as AriaMenuSection,
	MenuTrigger as AriaMenuTrigger,
	SubmenuTrigger as AriaSubmenuTrigger,
	composeRenderProps,
} from "react-aria-components";
import type * as React from "react";
import type {
	MenuItemProps as AriaMenuItemProps,
	MenuProps as AriaMenuProps,
	MenuSectionProps as AriaMenuSectionProps,
	MenuTriggerProps as AriaMenuTriggerProps,
	SubmenuTriggerProps as AriaSubmenuTriggerProps,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { cn } from "@/registry/lib/utils";

import { useStyles } from "./styles";
import type { MenuStyles } from "./styles";

// MARK: menuStyles

// MARK: seperator

interface MenuProps extends AriaMenuTriggerProps {}

const Menu = (props: MenuProps) => {
	return <AriaMenuTrigger {...props} />;
};

// MARK: seperator

interface MenuContentProps<T> extends AriaMenuProps<T> {}
const MenuContent = <T extends object>({ className, ...props }: MenuContentProps<T>) => {
	const { root } = useStyles()();
	return <AriaMenu className={composeRenderProps(className, (className) => root({ className }))} {...props} />;
};

// MARK: seperator

interface MenuSubProps extends AriaSubmenuTriggerProps {}

const MenuSub = (props: MenuSubProps) => {
	return <AriaSubmenuTrigger {...props} />;
};

// MARK: seperator

interface MenuItemProps<T> extends AriaMenuItemProps<T>, VariantProps<MenuStyles> {}

const MenuItem = <T extends object>({ className, variant, ...props }: MenuItemProps<T>) => {
	const { item } = useStyles()();
	return (
		<AriaMenuItem
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
		</AriaMenuItem>
	);
};

// MARK: seperator

interface MenuSectionProps<T> extends AriaMenuSectionProps<T> {}
const MenuSection = <T extends object>({ children, className, ...props }: MenuSectionProps<T>) => {
	const { section } = useStyles()();
	return (
		<AriaMenuSection className={section({ className })} {...props}>
			{children}
		</AriaMenuSection>
	);
};

// MARK: seperator

interface MenuSectionHeaderProps extends React.ComponentProps<typeof AriaHeader> {}

const MenuSectionHeader = ({ className, ...props }: MenuSectionHeaderProps) => {
	return <AriaHeader className={cn("font-medium text-fg-muted text-sm", className)} {...props} />;
};

// MARK: seperator

export { Menu, MenuItem, MenuContent, MenuSection, MenuSectionHeader, MenuSub };

export type { MenuProps, MenuContentProps, MenuItemProps, MenuSectionProps, MenuSectionHeaderProps, MenuSubProps };
