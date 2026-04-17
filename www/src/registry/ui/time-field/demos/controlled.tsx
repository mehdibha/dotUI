"use client";

import React from "react";
import { Time } from "@internationalized/date";
import type * as TimeFieldPrimitives from "react-aria-components/TimeField";

import { DateInput } from "@/registry/ui/input";
import { TimeField } from "@/registry/ui/time-field";

export default function Demo() {
	const [time, setTime] = React.useState<TimeFieldPrimitives.TimeValue | null>(new Time(11, 45));
	return (
		<div className="flex flex-col items-center gap-4">
			<TimeField aria-label="Event time" value={time} onChange={setTime}>
				<DateInput />
			</TimeField>
			<p className="text-fg-muted text-sm">selected time: {time?.toString()}</p>
		</div>
	);
}
