"use client";

import type * as React from "react";

import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as MenuPrimitives from "react-aria-components/Menu";

import { useStyles } from "./styles";

// MARK: menuStyles

// MARK: Separator

interface MenuProps extends MenuPrimitives.MenuTriggerProps {}

const Menu = (props: MenuProps) => {
	return <MenuPrimitives.MenuTrigger {...props} />;
};

// MARK: Separator

interface MenuContentProps<T> extends MenuPrimitives.MenuProps<T> {}
const MenuContent = <T extends object>({ className, ...props }: MenuContentProps<T>) => {
	const { root } = useStyles()();
	return (
		<MenuPrimitives.Menu
			data-menu-content=""
			className={composeRenderProps(className, (className) => root({ className }))}
			{...props}
		/>
	);
};

// MARK: Separator

interface MenuSubProps extends MenuPrimitives.SubmenuTriggerProps {}

const MenuSub = (props: MenuSubProps) => {
	return <MenuPrimitives.SubmenuTrigger {...props} />;
};

// MARK: Separator

interface MenuItemProps<T> extends MenuPrimitives.MenuItemProps<T> {
	variant?: "default" | "danger";
}

const MenuItem = <T extends object>({ className, variant, textValue: textValueProp, ...props }: MenuItemProps<T>) => {
	const { item, indicator } = useStyles()();
	const textValue = textValueProp || (typeof props.children === "string" ? props.children : undefined);

	return (
		<MenuPrimitives.MenuItem
			data-slot="menu-item"
			data-menu-item=""
			data-variant={variant}
			textValue={textValue}
			className={composeRenderProps(className, (className) => item({ className }))}
			{...props}
		>
			{composeRenderProps(props.children, (children, { selectionMode, isSelected, hasSubmenu }) => (
				<>
					{selectionMode !== "none" && (
						<span data-menu-item-indicator="" className={indicator()}>
							{isSelected && <CheckIcon aria-hidden className="size-4 text-fg-accent" />}
						</span>
					)}
					{typeof children === "string" ? <MenuItemLabel>{children}</MenuItemLabel> : children}
					{hasSubmenu && (
						<span data-menu-item-indicator="" className={indicator()}>
							<ChevronRightIcon aria-hidden className="size-4" />
						</span>
					)}
				</>
			))}
		</MenuPrimitives.MenuItem>
	);
};

// MARK: Separator

interface MenuItemLabelProps extends React.ComponentProps<typeof MenuPrimitives.Text> {}
const MenuItemLabel = ({ className, ...props }: MenuItemLabelProps) => {
	const { itemLabel } = useStyles()();
	return <MenuPrimitives.Text data-menu-item-label="" slot="label" className={itemLabel({ className })} {...props} />;
};

// MARK: Separator

interface MenuItemDescriptionProps extends React.ComponentProps<typeof MenuPrimitives.Text> {}
const MenuItemDescription = ({ className, ...props }: MenuItemDescriptionProps) => {
	const { itemDescription } = useStyles()();
	return (
		<MenuPrimitives.Text
			data-menu-item-description=""
			slot="description"
			className={itemDescription({ className })}
			{...props}
		/>
	);
};

// MARK: Separator

interface MenuSectionProps<T> extends MenuPrimitives.MenuSectionProps<T> {}
const MenuSection = <T extends object>({ children, className, ...props }: MenuSectionProps<T>) => {
	const { section } = useStyles()();
	return (
		<MenuPrimitives.MenuSection data-menu-section="" className={section({ className })} {...props}>
			{children}
		</MenuPrimitives.MenuSection>
	);
};

// MARK: Separator

interface MenuSectionHeaderProps extends React.ComponentProps<typeof MenuPrimitives.Header> {}

const MenuSectionHeader = ({ className, ...props }: MenuSectionHeaderProps) => {
	const { sectionTitle } = useStyles()();
	return <MenuPrimitives.Header data-menu-section-header="" className={sectionTitle({ className })} {...props} />;
};

// MARK: Separator

export type {
	MenuContentProps,
	MenuItemDescriptionProps,
	MenuItemLabelProps,
	MenuItemProps,
	MenuProps,
	MenuSectionHeaderProps,
	MenuSectionProps,
	MenuSubProps,
};
export { Menu, MenuContent, MenuItem, MenuItemDescription, MenuItemLabel, MenuSection, MenuSectionHeader, MenuSub };
