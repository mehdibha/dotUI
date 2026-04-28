"use client";

import { use } from "react";
import { CheckIcon } from "lucide-react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as ListBoxPrimitive from "react-aria-components/ListBox";
import * as VirtualizerPrimitive from "react-aria-components/Virtualizer";
import type React from "react";
import type * as TextPrimitive from "react-aria-components/Text";
import type { VariantProps } from "tailwind-variants";

import { Loader } from "@/registry/ui/loader";

import { useStyles } from "./styles";
import type { ListBoxStyles } from "./styles";

interface ListBoxProps<T> extends ListBoxPrimitive.ListBoxProps<T> {
	isLoading?: ListBoxPrimitive.ListBoxLoadMoreItemProps["isLoading"];
	onLoadMore?: ListBoxPrimitive.ListBoxLoadMoreItemProps["onLoadMore"];
}
const ListBox = <T extends object>({ className, isLoading, onLoadMore, ...props }: ListBoxProps<T>) => {
	const { root, loadMore } = useStyles()();
	const standalone = !use(ListBoxPrimitive.ListBoxContext);

	return (
		<ListBoxPrimitive.ListBox
			data-listbox=""
			className={composeRenderProps(className, (cn) => root({ className: cn }))}
			data-standalone={standalone ?? undefined}
			{...props}
		>
			<ListBoxPrimitive.Collection>{props.children}</ListBoxPrimitive.Collection>
			<ListBoxPrimitive.ListBoxLoadMoreItem className={loadMore()} isLoading={isLoading} onLoadMore={onLoadMore}>
				<Loader />
			</ListBoxPrimitive.ListBoxLoadMoreItem>
		</ListBoxPrimitive.ListBox>
	);
};

// MARK: Separator

interface ListBoxItemProps<T> extends ListBoxPrimitive.ListBoxItemProps<T>, VariantProps<ListBoxStyles> {}
const ListBoxItem = <T extends object>({
	className,
	variant,
	textValue: textValueProp,
	...props
}: ListBoxItemProps<T>) => {
	const { item, indicator } = useStyles()();
	const textValue = textValueProp || (typeof props.children === "string" ? props.children : undefined);

	return (
		<ListBoxPrimitive.ListBoxItem
			data-listbox-item=""
			textValue={textValue}
			className={composeRenderProps(className, (cn) => item({ className: cn, variant }))}
			{...props}
		>
			{composeRenderProps(props.children, (children, { selectionMode, isSelected }) => (
				<>
					{typeof children === "string" ? <ListBoxItemLabel>{children}</ListBoxItemLabel> : children}
					{selectionMode !== "none" && (
						<span data-listbox-item-indicator="" className={indicator()}>
							{isSelected && <CheckIcon />}
						</span>
					)}
				</>
			))}
		</ListBoxPrimitive.ListBoxItem>
	);
};

// MARK: Separator

interface ListBoxItemLabelProps extends React.ComponentProps<typeof TextPrimitive.Text> {}
const ListBoxItemLabel = ({ className, ...props }: ListBoxItemLabelProps) => {
	const { itemLabel } = useStyles()();
	return <ListBoxPrimitive.Text data-listbox-item-label="" className={itemLabel({ className })} {...props} />;
};

// MARK: Separator

interface ListBoxItemDescriptionProps extends React.ComponentProps<typeof TextPrimitive.Text> {}
const ListBoxItemDescription = ({ className, ...props }: ListBoxItemDescriptionProps) => {
	const { itemDescription } = useStyles()();
	return (
		<ListBoxPrimitive.Text data-listbox-item-description="" className={itemDescription({ className })} {...props} />
	);
};

// MARK: Separator

interface ListBoxSectionProps<T> extends ListBoxPrimitive.ListBoxSectionProps<T> {}
const ListBoxSection = <T extends object>({ className, ...props }: ListBoxSectionProps<T>) => {
	const { section } = useStyles()();
	return <ListBoxPrimitive.ListBoxSection data-listbox-section="" className={section({ className })} {...props} />;
};

// MARK: Separator

interface ListBoxSectionHeaderProps extends React.ComponentProps<typeof ListBoxPrimitive.Header> {}
const ListBoxSectionHeader = ({ className, ...props }: ListBoxSectionHeaderProps) => {
	const { sectionTitle } = useStyles()();
	return <ListBoxPrimitive.Header data-listbox-section-header="" className={sectionTitle({ className })} {...props} />;
};

// MARK: Separator

interface ListBoxVirtualizerProps<T> extends Omit<VirtualizerPrimitive.VirtualizerProps<T>, "layout"> {}
const ListBoxVirtualizer = <T extends object>({ ...props }: ListBoxVirtualizerProps<T>) => {
	return (
		<VirtualizerPrimitive.Virtualizer
			layout={VirtualizerPrimitive.ListLayout}
			layoutOptions={{
				rowHeight: 32,
				padding: 4,
				gap: 0,
			}}
			{...props}
		/>
	);
};

export type {
	ListBoxItemDescriptionProps,
	ListBoxItemLabelProps,
	ListBoxItemProps,
	ListBoxProps,
	ListBoxSectionHeaderProps,
	ListBoxSectionProps,
	ListBoxVirtualizerProps,
};
export {
	ListBox,
	ListBoxItem,
	ListBoxItemDescription,
	ListBoxItemLabel,
	ListBoxSection,
	ListBoxSectionHeader,
	ListBoxVirtualizer,
};
