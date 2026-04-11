"use client";

import { Heading } from "react-aria-components";

import { ChevronLeftIcon, ChevronRightIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import {
	Calendar,
	CalendarCell,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeader,
	CalendarHeaderCell,
} from "@/registry/ui/calendar";

export default function Demo() {
	return (
		<Calendar aria-label="Event date">
			<CalendarHeader>
				<Button slot="previous" className="rounded-full" size="icon-sm">
					<ChevronLeftIcon />
				</Button>
				<Heading className="text-fg-muted text-sm" />
				<Button slot="next" className="rounded-full" size="icon-sm">
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
