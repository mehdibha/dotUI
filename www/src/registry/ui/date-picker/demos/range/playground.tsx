"use client";

import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { RangeCalendar } from "@/registry/ui/calendar";
import { DateRangePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { DateInput, InputGroupAddon, InputGroup } from "@/registry/ui/input";
import { Overlay } from "@/registry/ui/overlay";

interface DateRangePickerPlaygroundProps {
	label?: string;
	isDisabled?: boolean;
	isReadOnly?: boolean;
}

export function DateRangePickerPlayground({
	label = "Date range",
	isDisabled = false,
	isReadOnly = false,
}: DateRangePickerPlaygroundProps) {
	return (
		<DateRangePicker isDisabled={isDisabled} isReadOnly={isReadOnly}>
			{label && <Label>{label}</Label>}
			<InputGroup>
				<DateInput slot="start" />
				<span>–</span>
				<DateInput slot="end" />
				<InputGroupAddon>
					<Button variant="default" size="icon-sm">
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
