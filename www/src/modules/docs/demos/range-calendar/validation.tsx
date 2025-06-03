"use client";

import { RangeCalendar } from "@/components/dynamic-ui/calendar";
import { getLocalTimeZone, today } from "@internationalized/date";

export default function Demo() {
  return (
    <RangeCalendar
      aria-label="Trip dates"
      minValue={today(getLocalTimeZone())}
    />
  );
}
