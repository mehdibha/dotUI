"use client";

import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";
import { TimeField } from "@dotui/registry/ui/time-field";

interface TimeFieldPlaygroundProps {
	label?: string;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	isInvalid?: boolean;
}

export function TimeFieldPlayground({ label = "Time", ...props }: TimeFieldPlaygroundProps) {
	return (
		<TimeField {...props}>
			{label && <Label>{label}</Label>}
			<DateInput />
		</TimeField>
	);
}
