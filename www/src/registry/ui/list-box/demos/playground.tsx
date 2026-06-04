"use client";

import { ListBox, ListBoxItem, type ListBoxProps } from "@/registry/ui/list-box";

export default function Demo({
	orientation = "vertical",
	selectionMode = "single",
}: {
	orientation?: ListBoxProps<object>["orientation"];
	selectionMode?: ListBoxProps<object>["selectionMode"];
} = {}) {
	return (
		<ListBox aria-label="Options" orientation={orientation} selectionMode={selectionMode}>
			<ListBoxItem id="alpha">Alpha</ListBoxItem>
			<ListBoxItem id="beta">Beta</ListBoxItem>
			<ListBoxItem id="gamma">Gamma</ListBoxItem>
		</ListBox>
	);
}
