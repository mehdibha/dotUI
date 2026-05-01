"use client";

import React from "react";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { useDateFormatter } from "react-aria";
import type * as RangeCalendarPrimitives from "react-aria-components/RangeCalendar";

import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { RangeCalendar } from "@/registry/ui/calendar";
import { DateRangePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	const [value, setValue] = React.useState<RangeCalendarPrimitives.DateRange | null>({
		start: parseDate("2024-02-03"),
		end: parseDate("2024-02-08"),
	});
	const formatter = useDateFormatter({ dateStyle: "long" });

	return (
		<>
			<DateRangePicker value={value} onChange={setValue}>
				<Label>Meeting date</Label>
				<InputGroup>
					<DateInput slot="start" />
					<span>–</span>
					<DateInput slot="end" />
					<InputGroupAddon>
						<Button variant="default" size="sm" isIconOnly>
							<CalendarIcon />
						</Button>
					</InputGroupAddon>
				</InputGroup>
				<Popover>
					<DialogContent>
						<RangeCalendar />
					</DialogContent>
				</Popover>
			</DateRangePicker>
			<p className="text-fg-muted text-sm">
				selected range:{" "}
				{value
					? formatter.formatRange(value.start.toDate(getLocalTimeZone()), value.end.toDate(getLocalTimeZone()))
					: "--"}
			</p>
		</>
	);
}
