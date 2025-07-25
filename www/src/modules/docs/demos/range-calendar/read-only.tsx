"use client";

import { RangeCalendar } from "@/components/dynamic-ui/calendar";
import { parseDate } from "@internationalized/date";

export default function Demo() {
  return (
    <RangeCalendar
      aria-label="Trip dates"
      isReadOnly
      value={{
        start: parseDate("2020-02-03"),
        end: parseDate("2020-02-12"),
      }}
    />
  );
}
