"use client";

import { Calendar } from "@/components/dynamic-ui/calendar";
import { getLocalTimeZone, today } from "@internationalized/date";

export default function Demo() {
  return (
    <Calendar
      aria-label="Appointment date"
      minValue={today(getLocalTimeZone())}
    />
  );
}
