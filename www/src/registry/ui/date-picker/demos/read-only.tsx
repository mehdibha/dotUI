"use client";

import { CalendarDate } from "@internationalized/date";

import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { DatePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { DateInput, InputGroupAddon, InputGroup } from "@/registry/ui/input";
import { Overlay } from "@/registry/ui/overlay";

export default function Demo() {
	return (
		<DatePicker value={new CalendarDate(1980, 1, 1)} isReadOnly>
			<Label>Event date</Label>
			<InputGroup>
				<DateInput />
				<InputGroupAddon>
					<Button variant="default" size="sm" isIconOnly>
						<CalendarIcon />
					</Button>
				</InputGroupAddon>
			</InputGroup>
			<Overlay type="popover" mobileType="drawer">
				<DialogContent>
					<Calendar />
				</DialogContent>
			</Overlay>
		</DatePicker>
	);
}
