"use client";

import { ClockIcon } from "lucide-react";

import { Description, Label } from "@dotui/registry/ui/field";
import { DateInput, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import { TimeField } from "@dotui/registry/ui/time-field";

export function TimeFieldDemo() {
	return (
		<div className="flex flex-col gap-6">
			<TimeField>
				<DateInput />
			</TimeField>

			<TimeField>
				<Label>Event time</Label>
				<DateInput />
				<Description>Please select your event time.</Description>
			</TimeField>

			<TimeField>
				<Label>Event time</Label>
				<InputGroup>
					<InputAddon>
						<ClockIcon />
					</InputAddon>
					<DateInput />
				</InputGroup>
			</TimeField>
		</div>
	);
}
