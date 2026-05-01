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
import { Popover } from "@/registry/ui/popover";

export default function Demo() {
	const [value, setValue] = React.useState<CalendarPrimitives.DateValue | null>(parseDate("2020-02-03"));
	return (
		<>
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
				<Popover>
					<DialogContent>
						<Calendar />
					</DialogContent>
				</Popover>
			</DatePicker>
			<p className="text-fg-muted text-sm">selected date: {value?.toString()}</p>
		</>
	);
}
