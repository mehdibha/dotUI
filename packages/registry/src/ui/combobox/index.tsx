"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";
import { ListBoxItem, ListBoxSection, ListBoxSectionHeader } from "@dotui/registry/ui/list-box";

import * as Default from "./basic";
import type { ComboboxContentProps, ComboboxInputProps, ComboboxProps } from "./types";

export const Combobox = <T extends object = object>(props: ComboboxProps<T>) => {
	const Component = createDynamicComponent<ComboboxProps<T>>("combobox", "Combobox", Default.Combobox, {});

	return <Component {...props} />;
};

export const ComboboxInput = createDynamicComponent<ComboboxInputProps>(
	"combobox",
	"ComboboxInput",
	Default.ComboboxInput,
	{},
);

export const ComboboxContent = <T extends object = object>(props: ComboboxContentProps<T>) => {
	const Component = createDynamicComponent<ComboboxContentProps<T>>(
		"combobox",
		"ComboboxContent",
		Default.ComboboxContent,
		{},
	);

	return <Component {...props} />;
};

export {
	ListBoxItem as ComboboxItem,
	ListBoxSection as ComboboxSection,
	ListBoxSectionHeader as ComboboxSectionHeader,
};

export type { ComboboxProps, ComboboxInputProps, ComboboxContentProps };
