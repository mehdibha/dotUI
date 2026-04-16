"use client";

import { ChevronDownIcon } from "lucide-react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SelectPrimitives from "react-aria-components/Select";


import { Button } from "@/registry/ui/button";
import { ListBox, ListBoxItem, ListBoxSection, ListBoxSectionHeader, ListBoxVirtualizer } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import type { ButtonProps } from "@/registry/ui/button";
import type { ListBoxProps } from "@/registry/ui/list-box";
import type { PopoverProps } from "@/registry/ui/popover";

import { useStyles } from "./styles";

// MARK: selectStyles

// MARK: seperator

interface SelectProps<T extends object> extends SelectPrimitives.SelectProps<T> {}

const Select = <T extends object>({ className, ...props }: SelectProps<T>) => {
	const { root } = useStyles()();
	return (
		<SelectPrimitives.Select
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
		<Button {...props}>
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

interface SelectValueProps<T extends object> extends SelectPrimitives.SelectValueProps<T> {}

const SelectValue = <T extends object>({ className, ...props }: SelectValueProps<T>) => {
	const { selectValue } = useStyles()();
	return (
		<SelectPrimitives.SelectValue
			data-slot="select-value"
			className={composeRenderProps(className, (className) => selectValue({ className }))}
			{...props}
		>
			{composeRenderProps(props.children, (children, { selectedText, defaultChildren }) => {
				return <>{children || selectedText || defaultChildren}</>;
			})}
		</SelectPrimitives.SelectValue>
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

export type { SelectContentProps, SelectProps, SelectValueProps };
export {
	ListBoxItem as SelectItem,
	ListBoxSection as SelectSection,
	ListBoxSectionHeader as SelectSectionHeader,
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
};
