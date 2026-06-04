"use client";

import Demo from "@/registry/ui/date-picker/demos/basic";

import { LivePreview } from "./live-preview";

/** Interactive DatePicker preview — click the calendar trigger to open it inside the card. */
export function DatePickerPreview() {
	return (
		<LivePreview className="flex-col items-stretch justify-start p-4">
			<Demo />
		</LivePreview>
	);
}
