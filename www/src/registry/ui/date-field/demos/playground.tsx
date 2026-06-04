"use client";

import { DateField } from "@/registry/ui/date-field";
import { Label } from "@/registry/ui/field";
import { DateInput } from "@/registry/ui/input";

export default function Demo({ label = "Date", isDisabled = false, isReadOnly = false, isInvalid = false } = {}) {
	return (
		<DateField isDisabled={isDisabled} isReadOnly={isReadOnly} isInvalid={isInvalid}>
			{label && <Label>{label}</Label>}
			<DateInput />
		</DateField>
	);
}
