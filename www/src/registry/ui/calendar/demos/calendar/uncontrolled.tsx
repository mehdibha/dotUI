"use client";

import { parseDate } from "@internationalized/date";

import { Calendar } from "@/registry/ui/calendar";

export default function Demo() {
	return <Calendar aria-label="Appointment date" defaultValue={parseDate("2020-02-03")} />;
}
