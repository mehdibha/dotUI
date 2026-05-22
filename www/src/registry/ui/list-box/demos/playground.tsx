"use client";

import { ListBox, ListBoxItem } from "@/registry/ui/list-box";

interface ListBoxPlaygroundProps {
	orientation?: "horizontal" | "vertical";
	selectionMode?: "none" | "single" | "multiple";
}

export function ListBoxPlayground({ orientation = "vertical", selectionMode = "single" }: ListBoxPlaygroundProps) {
	return (
		<ListBox aria-label="Options" orientation={orientation} selectionMode={selectionMode}>
			<ListBoxItem id="alpha">Alpha</ListBoxItem>
			<ListBoxItem id="beta">Beta</ListBoxItem>
			<ListBoxItem id="gamma">Gamma</ListBoxItem>
		</ListBox>
	);
}
