"use client";

import { getLocalTimeZone, today } from "@internationalized/date";

import { ChevronLeftIcon, ChevronRightIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import {
	Calendar,
	CalendarGrid,
	CalendarHeader,
	CalendarMonthPicker,
	CalendarYearPicker,
} from "@/registry/ui/calendar";
import { Card, CardContent } from "@/registry/ui/card";

export default function Demo() {
	return (
		<Card className="mx-auto w-fit">
			<CardContent>
				<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())}>
					<CalendarHeader>
						<Button slot="previous" variant="default" size="icon-sm">
							<ChevronLeftIcon />
						</Button>
						<div className="flex flex-1 gap-1.5">
							<CalendarMonthPicker />
							<CalendarYearPicker />
						</div>
						<Button slot="next" variant="default" size="icon-sm">
							<ChevronRightIcon />
						</Button>
					</CalendarHeader>
					<CalendarGrid />
				</Calendar>
			</CardContent>
		</Card>
	);
}
