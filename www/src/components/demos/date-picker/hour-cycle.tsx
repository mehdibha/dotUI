"use client";

import { DatePicker } from "@/components/dynamic-core/date-picker";

export default function Demo() {
  return (
    <DatePicker
      aria-label="Appointment date"
      granularity="minute"
      hourCycle={24}
    />
  );
}
