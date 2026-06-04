"use client";

import Demo from "@/registry/ui/combobox/demos/basic";

import { LivePreview } from "./live-preview";

/** Interactive Combobox preview — type/click to open the list inside the card. */
export function ComboboxPreview() {
	return (
		<LivePreview className="flex-col items-stretch justify-start p-4">
			<Demo />
		</LivePreview>
	);
}
