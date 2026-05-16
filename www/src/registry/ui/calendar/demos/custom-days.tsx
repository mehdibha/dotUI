"use client";

import React from "react";

import { getLocalTimeZone, isWeekend, today } from "@internationalized/date";
import * as I18nProviderPrimitives from "react-aria-components/I18nProvider";

import type * as CalendarPrimitives from "react-aria-components/Calendar";
import type * as RangeCalendarPrimitives from "react-aria-components/RangeCalendar";

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
	const { locale } = I18nProviderPrimitives.useLocale();
	const [range, setRange] = React.useState<RangeCalendarPrimitives.DateRange | null>({
		start: today(getLocalTimeZone()).add({ days: 2 }),
		end: today(getLocalTimeZone()).add({ days: 9 }),
	});

	const getPrice = (d: CalendarPrimitives.DateValue) => {
		if (isWeekend(d, locale)) return "$120";
		return "$100";
	};

	return (
		<Card className="mx-auto!">
			<CardContent>
				<RangeCalendar aria-label="Stay" value={range} onChange={setRange} className="[--cell-size:--spacing(12)]">
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
												<span className="text-xs text-fg-muted in-selection-start:text-fg-on-accent/60 in-selection-end:text-fg-on-accent/60">
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
