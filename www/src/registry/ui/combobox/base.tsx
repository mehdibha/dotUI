"use client";

import React from "react";
import { useResizeObserver } from "react-aria/private/utils/useResizeObserver";
import { ChevronDownIcon } from "lucide-react";
import { mergeProps } from "react-aria";
import * as ComboBoxPrimitives from "react-aria-components/ComboBox";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as GroupPrimitives from "react-aria-components/Group";
import * as PopoverPrimitives from "react-aria-components/Popover";
import { Provider } from "react-aria-components/slots";


import { cn } from "@/registry/lib/utils";
import { Button } from "@/registry/ui/button";
import { fieldStyles } from "@/registry/ui/field";
import { Input, InputAddon, InputGroup } from "@/registry/ui/input";
import { ListBox, ListBoxItem, ListBoxSection, ListBoxSectionHeader, ListBoxVirtualizer } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import type { InputGroupProps } from "@/registry/ui/input";
import type { ListBoxProps } from "@/registry/ui/list-box";
import type { PopoverProps } from "@/registry/ui/popover";

/* -----------------------------------------------------------------------------------------------*/

interface ComboboxProps<T extends object> extends Omit<ComboBoxPrimitives.ComboBoxProps<T>, "className"> {
	className?: string;
}
const Combobox = <T extends object>({ menuTrigger = "focus", className, ...props }: ComboboxProps<T>) => {
	return (
		<ComboBoxPrimitives.ComboBox
			menuTrigger={menuTrigger}
			className={fieldStyles().field({
				className: cn(className),
			})}
			{...props}
		>
			{composeRenderProps(props.children, (children) => (
				<ComboboxInner>{children}</ComboboxInner>
			))}
		</ComboBoxPrimitives.ComboBox>
	);
};

/* -----------------------------------------------------------------------------------------------*/

/**
 *  This abstraction allows the Combobox to work with InputGroup and
 *  sync the trigger width with the popover dropdown.
 */

const ComboboxInner = ({ children }: { children: React.ReactNode }) => {
	const [menuWidth, setMenuWidth] = React.useState<string | undefined>(undefined);

	const groupProps = React.use(GroupPrimitives.GroupContext);
	const popoverProps = React.use(PopoverPrimitives.PopoverContext);
	const triggerRef = React.useRef<HTMLDivElement>(null);

	const onResize = React.useCallback(() => {
		if (triggerRef.current) {
			const triggerWidth = triggerRef.current.getBoundingClientRect().width;
			setMenuWidth(`${triggerWidth}px`);
		}
	}, []);

	useResizeObserver({
		ref: triggerRef,
		onResize: onResize,
	});

	return (
		<Provider
			values={[
				[GroupPrimitives.GroupContext, mergeProps(groupProps, { ref: triggerRef })],
				[
					PopoverPrimitives.PopoverContext,
					triggerRef.current
						? {
								...mergeProps(popoverProps, {
									style: {
										"--trigger-width": menuWidth,
									} as React.CSSProperties,
								}),
								triggerRef,
							}
						: popoverProps,
				],
			]}
		>
			{children}
		</Provider>
	);
};

/* -----------------------------------------------------------------------------------------------*/

interface ComboboxInputProps extends InputGroupProps {
	placeholder?: string;
}

const ComboboxInput = ({ placeholder, ...props }: ComboboxInputProps) => {
	return (
		<InputGroup {...props}>
			<Input placeholder={placeholder} />
			<InputAddon>
				<Button variant="quiet" size="icon">
					<ChevronDownIcon />
				</Button>
			</InputAddon>
		</InputGroup>
	);
};

/* -----------------------------------------------------------------------------------------------*/

interface ComboboxContentProps<T extends object>
	extends ListBoxProps<T>,
		Pick<PopoverProps, "placement" | "defaultOpen" | "isOpen" | "onOpenChange"> {
	virtulized?: boolean;
}

const ComboboxContent = <T extends object>({
	virtulized,
	placement,
	defaultOpen,
	isOpen,
	onOpenChange,
	...props
}: ComboboxContentProps<T>) => {
	if (virtulized) {
		return (
			<Popover
				placement={placement}
				defaultOpen={defaultOpen}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				className="w-auto overflow-hidden p-0"
			>
				<ListBoxVirtualizer>
					<ListBox {...props} className="h-80 w-48 overflow-y-auto p-0" />
				</ListBoxVirtualizer>
			</Popover>
		);
	}

	return (
		<Popover placement={placement}>
			<ListBox {...props} />
		</Popover>
	);
};

/* -----------------------------------------------------------------------------------------------*/

export type { ComboboxContentProps, ComboboxInputProps, ComboboxProps };
export {
	Combobox,
	ComboboxContent,
	ComboboxInput,
	ListBoxItem as ComboboxItem,
	ListBoxSection as ComboboxSection,
	ListBoxSectionHeader as ComboboxSectionHeader,
};
