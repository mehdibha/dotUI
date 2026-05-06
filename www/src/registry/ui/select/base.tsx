"use client";

import { ChevronDownIcon } from "lucide-react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SelectPrimitives from "react-aria-components/Select";

import { cn } from "@/registry/lib/utils";
import { Button } from "@/registry/ui/button";
import { useStyles } from "@/registry/ui/field/styles";
import { ListBox, ListBoxItem, ListBoxSection, ListBoxSectionHeader, ListBoxVirtualizer } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import type { ButtonProps } from "@/registry/ui/button";
import type { ListBoxProps } from "@/registry/ui/list-box";
import type { PopoverProps } from "@/registry/ui/popover";

// MARK: selectStyles

// MARK: Separator

type SelectSelectionMode = "single" | "multiple";

interface SelectProps<T extends object, M extends SelectSelectionMode = "single">
	extends SelectPrimitives.SelectProps<T, M> {}

const Select = <T extends object, M extends SelectSelectionMode = "single">({
	className,
	...props
}: SelectProps<T, M>) => {
	const fieldStyles = useStyles();
	return (
		<SelectPrimitives.Select
			data-field=""
			data-select=""
			data-slot="select"
			className={composeRenderProps(className, (cn) => fieldStyles().field({ className: cn }))}
			{...props}
		/>
	);
};

// MARK: Separator

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

// MARK: Separator

interface SelectValueProps<T extends object> extends SelectPrimitives.SelectValueProps<T> {}

const SelectValue = <T extends object>({ className, ...props }: SelectValueProps<T>) => {
	return (
		<SelectPrimitives.SelectValue
			data-slot="select-value"
			className={composeRenderProps(className, (className) =>
				cn("flex-1 truncate text-left placeholder-shown:text-fg-muted", className),
			)}
			{...props}
		>
			{composeRenderProps(props.children, (children, { selectedText, defaultChildren }) => {
				return <>{children || selectedText || defaultChildren}</>;
			})}
		</SelectPrimitives.SelectValue>
	);
};

// MARK: Separator

interface SelectContentProps<T extends object>
	extends ListBoxProps<T>,
		Pick<PopoverProps, "placement" | "defaultOpen" | "isOpen" | "onOpenChange"> {
	placement?: PopoverProps["placement"];
	virtulized?: boolean;
}

const SelectContent = <T extends object>({
	virtulized,
	placement = "bottom",
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
