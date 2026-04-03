"use client";

import { DateField } from "@/registry/ui/date-field";
import { Label } from "@/registry/ui/field";
import { DateInput } from "@/registry/ui/input";

interface DateFieldPlaygroundProps {
	label?: string;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	isInvalid?: boolean;
}

export function DateFieldPlayground({ label = "Date", ...props }: DateFieldPlaygroundProps) {
	return (
		<DateField {...props}>
			{label && <Label>{label}</Label>}
			<DateInput />
		</DateField>
	);
}
