"use client";

import { getLocalTimeZone, today } from "@internationalized/date";
import { Calendar } from "@/components/dynamic-ui/calendar";

export default function Demo() {
  return (
    <Calendar
      aria-label="Appointment date"
      isReadOnly
      value={today(getLocalTimeZone())}
    />
  );
}
