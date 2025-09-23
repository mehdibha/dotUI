"use client";

import { parseZonedDateTime } from "@internationalized/date";

import { DateRangePicker } from "@dotui/ui/components/date-range-picker";

export default function Demo() {
  return (
    <DateRangePicker
      aria-label="Date range picker with time zones"
      defaultValue={{
        start: parseZonedDateTime("2022-11-07T00:45[America/Los_Angeles]"),
        end: parseZonedDateTime("2022-11-08T11:15[America/Los_Angeles]"),
      }}
    />
  );
}
