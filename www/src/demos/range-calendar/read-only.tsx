"use client";

import { getLocalTimeZone, today } from "@internationalized/date";
import { RangeCalendar } from "@/components/dynamic-core/calendar";

export default function Demo() {
  return (
    <RangeCalendar
      aria-label="Appointment date"
      isReadOnly
      value={{
        start: today(getLocalTimeZone()),
        end: today(getLocalTimeZone()).add({ weeks: 1 }),
      }}
    />
  );
}
