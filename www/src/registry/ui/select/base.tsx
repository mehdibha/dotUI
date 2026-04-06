"use client";

import { ChevronDownIcon } from "lucide-react";
import { Select as AriaSelect, SelectValue as AriaSelectValue, composeRenderProps } from "react-aria-components";
import type { SelectProps as AriaSelectProps, SelectValueProps as AriaSelectValueProps } from "react-aria-components";

import { Button } from "@/registry/ui/button";
import {
	ListBox,
	ListBoxItem,
	ListBoxSection,
	ListBoxSectionHeader,
	ListBoxVirtualizer,
} from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import type { ButtonProps } from "@/registry/ui/button";
import type { ListBoxProps } from "@/registry/ui/list-box";
import type { PopoverProps } from "@/registry/ui/popover";

import { useStyles } from "./styles";

// MARK: selectStyles

// MARK: seperator

interface SelectProps<T extends object> extends AriaSelectProps<T> {}

const Select = <T extends object>({ className, ...props }: SelectProps<T>) => {
	const { root } = useStyles()();
	return (
		<AriaSelect
			data-field=""
			data-select=""
			data-slot="select"
			className={composeRenderProps(className, (cn) => root({ className: cn }))}
			{...props}
		/>
	);
};

// MARK: seperator

const SelectTrigger = (props: ButtonProps) => {
	return (
		<Button aspect="default" {...props}>
			{composeRenderProps(props.children, (children) => {
				return (
					<>
						{children ?? <SelectValue />}
						<ChevronDownIcon className="ml-auto" />
					</>
				);
			})}
		</Button>
	);
};

// MARK: seperator

interface SelectValueProps<T extends object> extends AriaSelectValueProps<T> {}

const SelectValue = <T extends object>({ className, ...props }: SelectValueProps<T>) => {
	const { selectValue } = useStyles()();
	return (
		<AriaSelectValue
			data-slot="select-value"
			className={composeRenderProps(className, (className) => selectValue({ className }))}
			{...props}
		>
			{composeRenderProps(props.children, (children, { selectedText, defaultChildren }) => {
				return <>{children || selectedText || defaultChildren}</>;
			})}
		</AriaSelectValue>
	);
};

// MARK: seperator

interface SelectContentProps<T extends object>
	extends ListBoxProps<T>,
		Pick<PopoverProps, "placement" | "defaultOpen" | "isOpen" | "onOpenChange"> {
	placement?: PopoverProps["placement"];
	virtulized?: boolean;
}

const SelectContent = <T extends object>({
	virtulized,
	placement,
	defaultOpen,
	isOpen,
	onOpenChange,
	...props
}: SelectContentProps<T>) => {
	if (virtulized) {
		return (
			<Popover placement={placement} defaultOpen={defaultOpen} isOpen={isOpen} onOpenChange={onOpenChange}>
				<ListBoxVirtualizer>
					<ListBox {...props} />
				</ListBoxVirtualizer>
			</Popover>
		);
	}

	return (
		<Popover placement={placement} defaultOpen={defaultOpen} isOpen={isOpen} onOpenChange={onOpenChange}>
			<ListBox {...props} />
		</Popover>
	);
};

export {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	ListBoxItem as SelectItem,
	ListBoxSection as SelectSection,
	ListBoxSectionHeader as SelectSectionHeader,
};

export type { SelectProps, SelectValueProps, SelectContentProps };
