"use client";

import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";

interface ListBoxPlaygroundProps {
	selectionMode?: "none" | "single" | "multiple";
	orientation?: "horizontal" | "vertical";
}

export function ListBoxPlayground({ selectionMode = "single", orientation = "vertical" }: ListBoxPlaygroundProps) {
	return (
		<ListBox aria-label="Options" selectionMode={selectionMode} orientation={orientation}>
			<ListBoxItem id="1">Option 1</ListBoxItem>
			<ListBoxItem id="2">Option 2</ListBoxItem>
			<ListBoxItem id="3">Option 3</ListBoxItem>
			<ListBoxItem id="4">Option 4</ListBoxItem>
		</ListBox>
	);
}
