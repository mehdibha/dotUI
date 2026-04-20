"use client";

import { getLocalTimeZone, today } from "@internationalized/date";

import { ChevronLeftIcon, ChevronRightIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Calendar, CalendarGrid, CalendarHeader } from "@/registry/ui/calendar";
import { Card, CardContent } from "@/registry/ui/card";

export default function Demo() {
	return (
		<Card className="mx-auto w-fit">
			<CardContent>
				<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())}>
					<CalendarHeader>
						<Button slot="previous" variant="default" size="sm" isIconOnly>
							<ChevronLeftIcon />
						</Button>
						<div className="flex flex-1 gap-1.5">dropdowns</div>
						<Button slot="next" variant="default" size="sm" isIconOnly>
							<ChevronRightIcon />
						</Button>
					</CalendarHeader>
					<CalendarGrid />
				</Calendar>
			</CardContent>
		</Card>
	);
}
