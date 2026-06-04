"use client";

import Demo from "@/registry/ui/select/demos/basic";

import { LivePreview } from "./live-preview";

/** Interactive Select preview — click the trigger to open the list inside the card. */
export function SelectPreview() {
	return (
		<LivePreview className="flex-col items-stretch justify-start p-4">
			<Demo />
		</LivePreview>
	);
}
