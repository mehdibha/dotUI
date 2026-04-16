"use client";

import { getLocalTimeZone, today } from "@internationalized/date";
import * as CalendarPrimitives from "react-aria-components/Calendar";

import { Calendar } from "@/registry/ui/calendar";

export default function Demo() {
	const isWeekend = (d: CalendarPrimitives.DateValue) => {
		const day = d.toDate(getLocalTimeZone()).getDay();
		return day === 0 || day === 6;
	};
	return <Calendar aria-label="Date" defaultValue={today(getLocalTimeZone())} isDateUnavailable={isWeekend} />;
}
