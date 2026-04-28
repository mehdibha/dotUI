"use client";

import React from "react";
import { parseDate } from "@internationalized/date";
import type * as CalendarPrimitives from "react-aria-components/Calendar";

import { CalendarIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Calendar } from "@/registry/ui/calendar";
import { DatePicker } from "@/registry/ui/date-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { Label } from "@/registry/ui/field";
import { DateInput, InputGroup, InputGroupAddon } from "@/registry/ui/input";
import { Overlay } from "@/registry/ui/overlay";

export default function Demo() {
	const [value, setValue] = React.useState<CalendarPrimitives.DateValue | null>(parseDate("2020-02-03"));
	return (
		<div className="flex flex-col items-center gap-4">
			<DatePicker value={value} onChange={setValue}>
				<Label>Meeting date</Label>
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
			<p className="text-fg-muted text-sm">selected date: {value?.toString()}</p>
		</div>
	);
}
