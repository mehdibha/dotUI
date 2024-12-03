"use client";

import { getLocalTimeZone, today } from "@internationalized/date";
import { Calendar } from "@/components/dynamic-core/calendar";

export default function Demo() {
  return (
    <Calendar
      aria-label="Appointment date"
      minValue={today(getLocalTimeZone())}
    />
  );
}
