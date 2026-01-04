"use client";

import { getLocalTimeZone, today } from "@internationalized/date";

import { Calendar } from "@dotui/registry/ui/calendar";

export default function Demo() {
	return <Calendar aria-label="Appointment date" minValue={today(getLocalTimeZone())} />;
}
