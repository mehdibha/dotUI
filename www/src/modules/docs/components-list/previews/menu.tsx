"use client";

import Demo from "@/registry/ui/menu/demos/basic";

import { LivePreview } from "./live-preview";

/** Interactive Menu preview — click the trigger to open the menu inside the card. */
export function MenuPreview() {
	return (
		<LivePreview className="items-start justify-center pt-4">
			<Demo />
		</LivePreview>
	);
}
