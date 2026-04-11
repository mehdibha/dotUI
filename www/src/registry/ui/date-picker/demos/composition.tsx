"use client";

import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { DatePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { Description, FieldError, Label } from "@/registry/ui/field";
import { DateInput, InputAddon, InputGroup } from "@/registry/ui/input";
import { Overlay } from "@/registry/ui/overlay";

export default function Demo() {
	return (
		<DatePicker>
			<Label>Meeting date</Label>
			<InputGroup>
				<DateInput />
				<InputAddon>
					<Button variant="default" size="icon-sm">
						<CalendarIcon />
					</Button>
				</InputAddon>
			</InputGroup>
			<Description>Please select a date.</Description>
			<FieldError />
			<Overlay type="popover" mobileType="drawer">
				<DialogContent>
					<Calendar />
				</DialogContent>
			</Overlay>
		</DatePicker>
	);
}
