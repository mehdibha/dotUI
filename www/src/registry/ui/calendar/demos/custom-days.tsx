"use client";

import React from "react";
import { getLocalTimeZone, isWeekend, today } from "@internationalized/date";
import { useLocale } from "react-aria-components";
import type { DateRange, DateValue } from "react-aria-components";

import {
	CalendarCell,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeader,
	CalendarHeaderCell,
	RangeCalendar,
} from "@/registry/ui/calendar";
import { Card, CardContent } from "@/registry/ui/card";

export default function Demo() {
	const { locale } = useLocale();
	const [range, setRange] = React.useState<DateRange | null>({
		start: today(getLocalTimeZone()).add({ days: 2 }),
		end: today(getLocalTimeZone()).add({ days: 9 }),
	});

	const getPrice = (d: DateValue) => {
		if (isWeekend(d, locale)) return "$120";
		return "$100";
	};

	return (
		<Card className="mx-auto!">
			<CardContent>
				<RangeCalendar
					aria-label="Stay"
					value={range}
					onChange={setRange}
					className="[--cell-size:calc(var(--spacing)*12)]"
				>
					<CalendarHeader />
					<CalendarGrid>
						<CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
						<CalendarGridBody>
							{(date) => (
								<CalendarCell date={date}>
									{({ formattedDate, date, isOutsideMonth }) => (
										<span className="flex flex-col">
											<span>{formattedDate}</span>
											{!isOutsideMonth && (
												<span className="in-selection-end:text-fg-on-accent/60 in-selection-start:text-fg-on-accent/60 text-fg-muted text-xs">
													{getPrice(date)}
												</span>
											)}
										</span>
									)}
								</CalendarCell>
							)}
						</CalendarGridBody>
					</CalendarGrid>
				</RangeCalendar>
			</CardContent>
		</Card>
	);
}
