"use client";

import React from "react";

import { getLocalTimeZone, Time, today } from "@internationalized/date";
import { TimerIcon } from "lucide-react";

import type * as CalendarPrimitives from "react-aria-components/Calendar";

import { Calendar } from "@/registry/ui/calendar";
import { Card, CardContent, CardFooter } from "@/registry/ui/card";
import { Label } from "@/registry/ui/field";
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { TimeField } from "@/registry/ui/time-field";

export default function Demo() {
	const [date, setDate] = React.useState<CalendarPrimitives.DateValue | null>(today(getLocalTimeZone()));
	return (
		<Card className="mx-auto w-fit">
			<CardContent>
				<Calendar aria-label="Date" value={date} onChange={setDate} />
			</CardContent>
			<CardFooter className="flex flex-col gap-4 border-t">
				<TimeField className="w-full" defaultValue={new Time(11, 45)}>
					<Label>Start time</Label>
					<InputGroup>
						<InputGroupAddon>
							<TimerIcon />
						</InputGroupAddon>
						<DateInput />
					</InputGroup>
				</TimeField>
				<TimeField className="w-full" defaultValue={new Time(13, 30)}>
					<Label>End time</Label>
					<InputGroup>
						<InputGroupAddon>
							<TimerIcon />
						</InputGroupAddon>
						<DateInput />
					</InputGroup>
				</TimeField>
			</CardFooter>
		</Card>
	);
}
