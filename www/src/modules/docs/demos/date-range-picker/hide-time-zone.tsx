"use client";

import { DateRangePicker } from "@/components/dynamic-ui/date-range-picker";
import { parseAbsoluteToLocal } from "@internationalized/date";

export default function Demo() {
  return (
    <DateRangePicker
      label="Appointment time"
      granularity="minute"
      defaultValue={{
        start: parseAbsoluteToLocal("2021-04-07T18:45:22Z"),
        end: parseAbsoluteToLocal("2021-04-08T20:00:00Z"),
      }}
      hideTimeZone
    />
  );
}
