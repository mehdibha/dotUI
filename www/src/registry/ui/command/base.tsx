"use client";

import * as AutocompletePrimitive from "react-aria-components/Autocomplete";

import { useStyles } from "./styles";

// MARK: commandStyles

// MARK: Separator

interface CommandProps<T extends object>
	extends Omit<AutocompletePrimitive.AutocompleteProps<T>, "children" | "filter">,
		Omit<React.ComponentProps<"div">, "slot"> {
	filter?: Intl.CollatorOptions;
}

function Command<T extends object>({ className, slot, filter, ...props }: CommandProps<T>) {
	const commandStyles = useStyles();
	const { contains } = AutocompletePrimitive.useFilter({
		sensitivity: "base",
		ignorePunctuation: true,
		...filter,
	});

	return (
		<AutocompletePrimitive.Autocomplete filter={contains}>
			<div data-command="" className={commandStyles({ className })} {...props} />
		</AutocompletePrimitive.Autocomplete>
	);
}

// MARK: Separator

export type { CommandProps };
export { Command };
