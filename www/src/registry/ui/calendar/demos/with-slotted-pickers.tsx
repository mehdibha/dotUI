"use client";

import { getLocalTimeZone, today } from "@internationalized/date";

import { ChevronLeftIcon, ChevronRightIcon } from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Calendar, CalendarGrid, CalendarHeader } from "@/registry/ui/calendar";
import { Card, CardContent } from "@/registry/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";

const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export default function Demo() {
	const currentYear = today(getLocalTimeZone()).year;
	const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

	return (
		<Card className="mx-auto w-fit">
			<CardContent className="p-0">
				<Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())}>
					<CalendarHeader>
						<Button slot="previous" variant="default" size="icon-sm">
							<ChevronLeftIcon />
						</Button>
						<div className="flex flex-1 gap-1.5">
							<Select slot="month-picker">
								<SelectTrigger slot={null} />
								<SelectContent>
									{MONTHS.map((name, i) => (
										<SelectItem key={i + 1} id={String(i + 1)}>
											{name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select slot="year-picker">
								<SelectTrigger slot={null} />
								<SelectContent>
									{years.map((y) => (
										<SelectItem key={y} id={String(y)}>
											{y}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
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
