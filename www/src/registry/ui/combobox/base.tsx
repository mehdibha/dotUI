"use client";

import { ChevronDownIcon } from "lucide-react";
import * as ComboBoxPrimitives from "react-aria-components/ComboBox";

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

export type { ComboboxContentProps, ComboboxInputProps, ComboboxProps };
export {
	Combobox,
	ComboboxContent,
	ComboboxInput,
	ListBoxItem as ComboboxItem,
	ListBoxSection as ComboboxSection,
	ListBoxSectionHeader as ComboboxSectionHeader,
};
