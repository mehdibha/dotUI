"use client";

import { DateField } from "@/registry/ui/date-field";
import { DateInput } from "@/registry/ui/input";

export default function Demo() {
	return (
		<DateField aria-label="Event date" isRequired>
			<DateInput />
		</DateField>
	);
}
