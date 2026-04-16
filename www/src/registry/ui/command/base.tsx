"use client";

import { SearchIcon } from "lucide-react";
import * as AutocompletePrimitives from "react-aria-components/Autocomplete";
import * as ComboBoxPrimitives from "react-aria-components/ComboBox";

import { Input, InputAddon, InputGroup } from "@/registry/ui/input";
import { ListBox, ListBoxItem, ListBoxSection, ListBoxSectionHeader, ListBoxVirtualizer } from "@/registry/ui/list-box";
import { SearchField } from "@/registry/ui/search-field";
import type { ListBoxProps } from "@/registry/ui/list-box";
import type { PopoverProps } from "@/registry/ui/popover";
import type { SearchFieldProps } from "@/registry/ui/search-field";

import { useStyles } from "./styles";

// MARK: commandStyles

// MARK: seperator

interface CommandProps extends React.ComponentProps<"div"> {}

function Command({ className, ...props }: CommandProps) {
	const { base } = useStyles()();
	const { contains } = ComboBoxPrimitives.useFilter({
		sensitivity: "base",
		ignorePunctuation: true,
	});

	return (
		<AutocompletePrimitives.Autocomplete filter={contains}>
			<div {...props} className={base({ className })}></div>
		</AutocompletePrimitives.Autocomplete>
	);
}

// MARK: seperator

interface CommandInputProps extends SearchFieldProps {
	placeholder?: string;
}

const CommandInput = ({ placeholder, ...props }: CommandInputProps) => {
	return (
		<SearchField {...props}>
			{/* TODO: Remove this */}
			<InputGroup className="w-full">
				<InputAddon>
					<SearchIcon />
				</InputAddon>
				<Input placeholder={placeholder} />
			</InputGroup>
		</SearchField>
	);
};

// MARK: seperator

interface CommandContentProps<T extends object> extends ListBoxProps<T> {
	placement?: PopoverProps["placement"];
	virtulized?: boolean;
}

const CommandContent = <T extends object>({ virtulized, placement, ...props }: CommandContentProps<T>) => {
	if (virtulized) {
		return (
			<ListBoxVirtualizer>
				<ListBox {...props} className="h-80 w-48 overflow-y-auto p-0" />
			</ListBoxVirtualizer>
		);
	}

	return <ListBox {...props} />;
};

// MARK: seperator

export type { CommandContentProps, CommandInputProps, CommandProps };
export {
	Command,
	CommandContent,
	CommandInput,
	ListBoxItem as CommandItem,
	ListBoxSection as CommandSection,
	ListBoxSectionHeader as CommandSectionHeader,
};
