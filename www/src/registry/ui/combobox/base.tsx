"use client";

import { ChevronDownIcon } from "lucide-react";
import * as ComboBoxPrimitive from "react-aria-components/ComboBox";
import { composeRenderProps } from "react-aria-components/composeRenderProps";

import { cn } from "@/registry/lib/utils";
import { Button } from "@/registry/ui/button";
import { fieldStyles } from "@/registry/ui/field";
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { ListBox, ListBoxItem, ListBoxSection, ListBoxSectionHeader, ListBoxVirtualizer } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import type { InputGroupProps } from "@/registry/ui/input";
import type { ListBoxProps } from "@/registry/ui/list-box";
import type { PopoverProps } from "@/registry/ui/popover";

/* -----------------------------------------------------------------------------------------------*/

interface ComboboxProps<T extends object, M extends "single" | "multiple" = "single">
	extends ComboBoxPrimitive.ComboBoxProps<T, M> {}
const Combobox = <T extends object, M extends "single" | "multiple" = "single">({
	menuTrigger = "focus",
	className,
	...props
}: ComboboxProps<T, M>) => {
	return (
		<ComboBoxPrimitive.ComboBox
			menuTrigger={menuTrigger}
			className={composeRenderProps(className, (cn) =>
				fieldStyles().field({
					className: cn,
				}),
			)}
			{...props}
		/>
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
			<InputGroupAddon>
				<Button variant="quiet" isIconOnly>
					<ChevronDownIcon />
				</Button>
			</InputGroupAddon>
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

interface ComboboxValueProps<T extends object> extends ComboBoxPrimitive.ComboBoxValueProps<T> {}
const ComboboxValue = <T extends object>({ className, ...props }: ComboboxValueProps<T>) => {
	return (
		<ComboBoxPrimitive.ComboBoxValue
			data-combobox-value=""
			className={composeRenderProps(className, (c) => cn("flex items-center gap-1", c))}
			{...props}
		/>
	);
};

export type { ComboboxContentProps, ComboboxInputProps, ComboboxProps };
export {
	Combobox,
	ComboboxContent,
	ComboboxInput,
	ComboboxValue,
	ListBoxItem as ComboboxItem,
	ListBoxSection as ComboboxSection,
	ListBoxSectionHeader as ComboboxSectionHeader,
};
