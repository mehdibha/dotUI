"use client";

import { parseDate } from "@internationalized/date";
import { RangeCalendar } from "@/lib/components/core/default/range-calendar";

export default function Demo() {
  return (
    <RangeCalendar
      defaultValue={{
        start: parseDate("2024-06-10"),
        end: parseDate("2024-06-19"),
      }}
    />
  );
}
