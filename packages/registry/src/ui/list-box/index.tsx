"use client";

import { createDynamicComponent } from "@dotui/core/components/create-dynamic-component";

import * as Default from "./basic";
import type {
	ListBoxItemProps,
	ListBoxProps,
	ListBoxSectionHeaderProps,
	ListBoxSectionProps,
	ListBoxVirtualizerProps,
} from "./types";

export const ListBox = <T extends object = object>(props: ListBoxProps<T>) => {
	const Component = createDynamicComponent<ListBoxProps<T>>("list-box", "ListBox", Default.ListBox, {});

	return <Component {...props} />;
};

export const ListBoxItem = <T extends object = object>(props: ListBoxItemProps<T>) => {
	const Component = createDynamicComponent<ListBoxItemProps<T>>("list-box", "ListBoxItem", Default.ListBoxItem, {});

	return <Component {...props} />;
};

export const ListBoxSection = <T extends object = object>(props: ListBoxSectionProps<T>) => {
	const Component = createDynamicComponent<ListBoxSectionProps<T>>(
		"list-box",
		"ListBoxSection",
		Default.ListBoxSection,
		{},
	);

	return <Component {...props} />;
};

export const ListBoxSectionHeader = createDynamicComponent<ListBoxSectionHeaderProps>(
	"list-box",
	"ListBoxSectionHeader",
	Default.ListBoxSectionHeader,
	{},
);

export const ListBoxVirtualizer = <T extends object = object>(props: ListBoxVirtualizerProps<T>) => {
	const Component = createDynamicComponent<ListBoxVirtualizerProps<T>>(
		"list-box",
		"ListBoxVirtualizer",
		Default.ListBoxVirtualizer,
		{},
	);

	return <Component {...props} />;
};

export type { ListBoxProps, ListBoxItemProps, ListBoxSectionProps, ListBoxSectionHeaderProps, ListBoxVirtualizerProps };
