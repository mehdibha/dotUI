"use client";

import React from "react";
import { CheckIcon } from "lucide-react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as HeaderPrimitives from "react-aria-components/Header";
import * as LabelPrimitives from "react-aria-components/Label";
import * as ListBoxPrimitive from "react-aria-components/ListBox";
import { type ContextValue, Provider, useSlottedContext } from "react-aria-components/slots";
import * as TextPrimitives from "react-aria-components/Text";
import * as VirtualizerPrimitives from "react-aria-components/Virtualizer";
import type { VariantProps } from "tailwind-variants";

import { useStyles } from "./styles";
import type { ListBoxStyles } from "./styles";

// MARK: listBoxStyles

// MARK: seperator

interface ListBoxProps<T> extends ListBoxPrimitive.ListBoxProps<T> {
	isLoading?: boolean;
}

const ListBox = <T extends object>({ className, isLoading, ...props }: ListBoxProps<T>) => {
	const { root } = useStyles()();
	const standalone = !React.use(ListBoxPrimitive.ListStateContext);
	return (
		<ListBoxPrimitive.ListBox
			data-standalone={standalone || undefined}
			className={composeRenderProps(className, (cn) => root({ className: cn }))}
			{...props}
		/>
	);
};

// MARK: seperator

interface ListBoxItemProps<T> extends ListBoxPrimitive.ListBoxItemProps<T>, VariantProps<ListBoxStyles> {}

const ListBoxItem = <T extends object>({
	className,
	variant,
	textValue: textValueProp,
	...props
}: ListBoxItemProps<T>) => {
	const { item } = useStyles()();
	const textValue = textValueProp || (typeof props.children === "string" ? props.children : undefined);

	return (
		<ListBoxPrimitive.ListBoxItem
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
		</ListBoxPrimitive.ListBoxItem>
	);
};

const ListBoxItemInner = ({ children }: { children: React.ReactNode }) => {
	const labelProps = useSlottedContext(TextPrimitives.TextContext, "label")!;
	return (
		<Provider
			values={[
				[
					LabelPrimitives.LabelContext as React.Context<ContextValue<LabelPrimitives.LabelProps, HTMLElement>>,
					labelProps,
				],
			]}
		>
			{children}
		</Provider>
	);
};

// MARK: seperator

interface ListBoxSectionProps<T> extends ListBoxPrimitive.ListBoxSectionProps<T> {}

const ListBoxSection = <T extends object>({ className, ...props }: ListBoxSectionProps<T>) => {
	const { section } = useStyles()();
	return <ListBoxPrimitive.ListBoxSection data-slot="listbox-section" className={section({ className })} {...props} />;
};

// MARK: seperator

interface ListBoxSectionHeaderProps extends React.ComponentProps<typeof HeaderPrimitives.Header> {}

const ListBoxSectionHeader = ({ className, ...props }: ListBoxSectionHeaderProps) => {
	const { sectionTitle } = useStyles()();
	return <HeaderPrimitives.Header className={sectionTitle({ className })} {...props} />;
};

// MARK: seperator

interface ListBoxVirtualizerProps<T> extends Omit<VirtualizerPrimitives.VirtualizerProps<T>, "layout"> {}

const ListBoxVirtualizer = <T extends object>({ ...props }: ListBoxVirtualizerProps<T>) => {
	return (
		<VirtualizerPrimitives.Virtualizer
			layout={VirtualizerPrimitives.ListLayout}
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

export type { ListBoxItemProps, ListBoxProps, ListBoxSectionHeaderProps, ListBoxSectionProps, ListBoxVirtualizerProps };
export { ListBox, ListBoxItem, ListBoxSection, ListBoxSectionHeader, ListBoxVirtualizer };
