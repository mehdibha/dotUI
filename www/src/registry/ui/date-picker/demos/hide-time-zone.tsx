"use client";

import { parseZonedDateTime } from "@internationalized/date";

import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { DatePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	return (
		<DatePicker
			granularity="minute"
			defaultValue={parseZonedDateTime("2022-11-07T10:45[America/Los_Angeles]")}
			hideTimeZone
		>
			<Label>Appointment time</Label>
			<InputGroup>
				<DateInput />
				<InputGroupAddon>
					<Button variant="default" size="sm" isIconOnly>
						<CalendarIcon />
					</Button>
				</InputGroupAddon>
			</InputGroup>
			<Popover>
				<DialogContent>
					<Calendar />
				</DialogContent>
			</Popover>
		</DatePicker>
	);
}
