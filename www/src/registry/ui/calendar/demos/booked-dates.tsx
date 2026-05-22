"use client";

import React from "react";

import { getLocalTimeZone, today } from "@internationalized/date";

import type * as CalendarPrimitives from "react-aria-components/Calendar";

import { Calendar } from "@/registry/ui/calendar";

export default function Demo() {
	const [date, setDate] = React.useState<CalendarPrimitives.DateValue | null>(today(getLocalTimeZone()));
	const now = today(getLocalTimeZone());
	const bookedStart = now.add({ days: 5 });
	const bookedEnd = now.add({ days: 19 });
	const isBooked = (d: CalendarPrimitives.DateValue) => d.compare(bookedStart) >= 0 && d.compare(bookedEnd) <= 0;

	return <Calendar aria-label="Booking date" value={date} onChange={setDate} isDateUnavailable={isBooked} />;
}
