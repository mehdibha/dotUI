"use client";

import { Heading } from "react-aria-components";

import { ChevronLeftIcon, ChevronRightIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import {
	Calendar,
	CalendarCell,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeader,
	CalendarHeaderCell,
} from "@dotui/registry/ui/calendar";

export default function Demo() {
	return (
		<Calendar mode="range" aria-label="Trip dates">
			<CalendarHeader>
				<Button slot="previous" className="rounded-full" size="sm">
					<ChevronLeftIcon />
				</Button>
				<Heading className="text-sm" />
				<Button slot="next" className="rounded-full" size="sm">
					<ChevronRightIcon />
				</Button>
			</CalendarHeader>
			<CalendarGrid>
				<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
				<CalendarGridBody>{(date) => <CalendarCell date={date} />}</CalendarGridBody>
			</CalendarGrid>
		</Calendar>
	);
}
