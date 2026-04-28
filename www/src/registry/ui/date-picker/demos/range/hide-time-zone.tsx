"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";

import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { RangeCalendar } from "@/registry/ui/calendar";
import { DateRangePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { Overlay } from "@/registry/ui/overlay";

export default function Demo() {
	return (
		<DateRangePicker
			granularity="minute"
			defaultValue={{
				start: parseAbsoluteToLocal("2021-04-07T18:45:22Z"),
				end: parseAbsoluteToLocal("2021-04-08T20:00:00Z"),
			}}
			hideTimeZone
		>
			<Label>Appointment time</Label>
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
			<Overlay type="popover" mobileType="drawer">
				<DialogContent>
					<RangeCalendar />
				</DialogContent>
			</Overlay>
		</DateRangePicker>
	);
}
