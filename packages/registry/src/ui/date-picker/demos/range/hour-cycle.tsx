"use client";

import { DateRangePicker } from "@dotui/registry/ui/date-range-picker";

export default function Demo() {
  return (
    <DateRangePicker
      aria-label="Appointment date"
      granularity="minute"
      hourCycle={24}
    />
  );
}
