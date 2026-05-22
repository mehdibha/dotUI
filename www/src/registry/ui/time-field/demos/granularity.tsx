"use client";

import { Time } from "@internationalized/date";

import { Label } from "@/registry/ui/field";
import { DateInput } from "@/registry/ui/input";
import { TimeField } from "@/registry/ui/time-field";

export default function Demo() {
	return (
		<>
			<TimeField granularity="hour" defaultValue={new Time(11, 45, 22)}>
				<Label>Hour</Label>
				<DateInput />
			</TimeField>
			<TimeField granularity="minute" defaultValue={new Time(11, 45, 22)}>
				<Label>Minute</Label>
				<DateInput />
			</TimeField>
			<TimeField granularity="second" defaultValue={new Time(11, 45, 22)}>
				<Label>Second</Label>
				<DateInput />
			</TimeField>
		</>
	);
}
