"use client";

import { DatePicker } from "@/registry/ui/default/core/date-picker";

export default function Demo() {
  return (
    <DatePicker
      aria-label="Appointment date"
      granularity="minute"
      hourCycle={24}
    />
  );
}
