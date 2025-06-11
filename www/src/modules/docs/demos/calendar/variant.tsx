"use client";

import { Calendar } from "@/components/dynamic-ui/calendar";
import { parseDate } from "@internationalized/date";

export default function Demo() {
  return (
    <Calendar
      aria-label="Appointment date"
      variant="primary"
      defaultValue={parseDate("2025-01-01")}
    />
  );
}
