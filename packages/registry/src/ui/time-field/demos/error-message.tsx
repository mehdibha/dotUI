"use client";

import { FieldError, Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";
import { TimeField } from "@dotui/registry/ui/time-field";

export default function Demo() {
	return (
		<TimeField isInvalid>
			<Label>Meeting</Label>
			<DateInput />
			<FieldError>Meetings start every 15 minutes.</FieldError>
		</TimeField>
	);
}
