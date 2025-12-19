"use client";

import { createDynamicComponent } from "@dotui/core/components/create-dynamic-component";
import type { ButtonProps } from "@dotui/registry/ui/button";
import type { ListBoxItemProps, ListBoxSectionHeaderProps, ListBoxSectionProps } from "@dotui/registry/ui/list-box";

import * as Default from "./basic";
import type { SelectContentProps, SelectProps, SelectValueProps } from "./types";

export const Select = <T extends object = object>(props: SelectProps<T>) => {
	const Component = createDynamicComponent<SelectProps<T>>("select", "Select", Default.Select, {});

	return <Component {...props} />;
};

export const SelectTrigger = createDynamicComponent<ButtonProps>(
	"select",
	"SelectTrigger",
	Default.SelectTrigger,
	{},
	{ disableSkeleton: true },
);

export const SelectValue = <T extends object = object>(props: SelectValueProps<T>) => {
	const Component = createDynamicComponent<SelectValueProps<T>>("select", "SelectValue", Default.SelectValue, {});

	return <Component {...props} />;
};

export const SelectContent = <T extends object = object>(props: SelectContentProps<T>) => {
	const Component = createDynamicComponent<SelectContentProps<T>>("select", "SelectContent", Default.SelectContent, {});
	return <Component {...props} />;
};

export const SelectItem = <T extends object = object>(props: ListBoxItemProps<T>) => {
	const Component = createDynamicComponent<ListBoxItemProps<T>>("select", "SelectItem", Default.SelectItem, {});

	return <Component {...props} />;
};

export const SelectSection = <T extends object = object>(props: ListBoxSectionProps<T>) => {
	const Component = createDynamicComponent<ListBoxSectionProps<T>>(
		"select",
		"SelectSection",
		Default.SelectSection,
		{},
	);
	return <Component {...props} />;
};

export const SelectSectionHeader = createDynamicComponent<ListBoxSectionHeaderProps>(
	"select",
	"SelectSectionHeader",
	Default.SelectSectionHeader,
	{},
);

export type { SelectProps, SelectContentProps, SelectValueProps };
