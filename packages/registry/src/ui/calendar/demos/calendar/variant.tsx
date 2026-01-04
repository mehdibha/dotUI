"use client";

import { parseDate } from "@internationalized/date";

import { Calendar } from "@dotui/registry/ui/calendar";

export default function Demo() {
	return <Calendar aria-label="Appointment date" defaultValue={parseDate("2025-01-01")} />;
}
