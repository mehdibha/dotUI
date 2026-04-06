"use client";

import React from "react";
import { CheckIcon } from "lucide-react";
import {
	Header as AriaHeader,
	ListBox as AriaListBox,
	ListBoxItem as AriaListBoxItem,
	ListBoxSection as AriaListBoxSection,
	TextContext as AriaTextContext,
	Virtualizer as AriaVirtualizer,
	composeRenderProps,
	LabelContext,
	ListLayout,
	ListStateContext,
	Provider,
	useSlottedContext,
} from "react-aria-components";
import type {
	LabelProps as AriaLabelProps,
	ListBoxItemProps as AriaListBoxItemProps,
	ListBoxProps as AriaListBoxProps,
	ListBoxSectionProps as AriaListBoxSectionProps,
	VirtualizerProps as AriaVirtualizerProps,
	ContextValue,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import { useStyles } from "./styles";
import type { ListBoxStyles } from "./styles";

// MARK: listBoxStyles

// MARK: seperator

interface ListBoxProps<T> extends AriaListBoxProps<T> {
	isLoading?: boolean;
}

const ListBox = <T extends object>({ className, isLoading, ...props }: ListBoxProps<T>) => {
	const { root } = useStyles()();
	const standalone = !React.use(ListStateContext);
	return (
		<AriaListBox
			data-standalone={standalone || undefined}
			className={composeRenderProps(className, (cn) => root({ className: cn }))}
			{...props}
		/>
	);
};

// MARK: seperator

interface ListBoxItemProps<T> extends AriaListBoxItemProps<T>, VariantProps<ListBoxStyles> {}

const ListBoxItem = <T extends object>({
	className,
	variant,
	textValue: textValueProp,
	...props
}: ListBoxItemProps<T>) => {
	const { item } = useStyles()();
	const textValue = textValueProp || (typeof props.children === "string" ? props.children : undefined);

	return (
		<AriaListBoxItem
			textValue={textValue}
			className={composeRenderProps(className, (cn) => item({ className: cn, variant }))}
			{...props}
		>
			{composeRenderProps(props.children, (children, { selectionMode, isSelected }) => (
				<ListBoxItemInner>
					{children}
					{selectionMode !== "none" && (
						<span className="pointer-events-none absolute right-2 flex size-3.5 items-center justify-center">
							{isSelected && <CheckIcon className="size-4" />}
						</span>
					)}
				</ListBoxItemInner>
			))}
		</AriaListBoxItem>
	);
};

const ListBoxItemInner = ({ children }: { children: React.ReactNode }) => {
	const labelProps = useSlottedContext(AriaTextContext, "label")!;
	return (
		<Provider values={[[LabelContext as React.Context<ContextValue<AriaLabelProps, HTMLElement>>, labelProps]]}>
			{children}
		</Provider>
	);
};

// MARK: seperator

interface ListBoxSectionProps<T> extends AriaListBoxSectionProps<T> {}

const ListBoxSection = <T extends object>({ className, ...props }: ListBoxSectionProps<T>) => {
	const { section } = useStyles()();
	return <AriaListBoxSection data-slot="listbox-section" className={section({ className })} {...props} />;
};

// MARK: seperator

interface ListBoxSectionHeaderProps extends React.ComponentProps<typeof AriaHeader> {}

const ListBoxSectionHeader = ({ className, ...props }: ListBoxSectionHeaderProps) => {
	const { sectionTitle } = useStyles()();
	return <AriaHeader className={sectionTitle({ className })} {...props} />;
};

// MARK: seperator

interface ListBoxVirtualizerProps<T> extends Omit<AriaVirtualizerProps<T>, "layout"> {}

const ListBoxVirtualizer = <T extends object>({ ...props }: ListBoxVirtualizerProps<T>) => {
	return (
		<AriaVirtualizer
			layout={ListLayout}
			layoutOptions={{
				rowHeight: 32,
				padding: 4,
				gap: 0,
			}}
			{...props}
		/>
	);
};
// MARK: seperator

export { ListBox, ListBoxItem, ListBoxSection, ListBoxSectionHeader, ListBoxVirtualizer };

export type { ListBoxProps, ListBoxItemProps, ListBoxSectionProps, ListBoxSectionHeaderProps, ListBoxVirtualizerProps };
