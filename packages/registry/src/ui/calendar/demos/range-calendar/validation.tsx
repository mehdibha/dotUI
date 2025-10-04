"use client";

import { getLocalTimeZone, today } from "@internationalized/date";

import { RangeCalendar } from "@dotui/registry/ui/calendar";

export default function Demo() {
  return (
    <RangeCalendar
      aria-label="Trip dates"
      minValue={today(getLocalTimeZone())}
    />
  );
}
