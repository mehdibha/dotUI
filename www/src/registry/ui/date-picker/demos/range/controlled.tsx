"use client";

import React from "react";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { useDateFormatter } from "react-aria";
import type { DateRange } from "react-aria-components";

import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { RangeCalendar } from "@/registry/ui/calendar";
import { DateRangePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { DateInput, InputAddon, InputGroup } from "@/registry/ui/input";
import { Overlay } from "@/registry/ui/overlay";

export default function Demo() {
	const [value, setValue] = React.useState<DateRange | null>({
		start: parseDate("2024-02-03"),
		end: parseDate("2024-02-08"),
	});
	const formatter = useDateFormatter({ dateStyle: "long" });

	return (
		<div className="flex flex-col items-center gap-4">
			<DateRangePicker value={value} onChange={setValue}>
				<Label>Meeting date</Label>
				<InputGroup>
					<DateInput slot="start" />
					<span>–</span>
					<DateInput slot="end" />
					<InputAddon>
						<Button variant="default" size="icon-sm">
							<CalendarIcon />
						</Button>
					</InputAddon>
				</InputGroup>
				<Overlay type="popover" mobileType="drawer">
					<DialogContent>
						<RangeCalendar />
					</DialogContent>
				</Overlay>
			</DateRangePicker>
			<p className="text-fg-muted text-sm">
				selected range:{" "}
				{value
					? formatter.formatRange(value.start.toDate(getLocalTimeZone()), value.end.toDate(getLocalTimeZone()))
					: "--"}
			</p>
		</div>
	);
}
