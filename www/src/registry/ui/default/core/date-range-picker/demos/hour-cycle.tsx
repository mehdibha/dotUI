"use client";

import { DateRangePicker } from "@/registry/ui/default/core/date-range-picker";

export default function Demo() {
  return (
    <DateRangePicker
      aria-label="Appointment date"
      granularity="minute"
      hourCycle={24}
    />
  );
}
