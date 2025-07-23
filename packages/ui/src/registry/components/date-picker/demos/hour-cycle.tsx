"use client";

import { DatePicker } from "@dotui/ui/components/date-picker";

export default function Demo() {
  return (
    <DatePicker
      aria-label="Appointment date"
      granularity="minute"
      hourCycle={24}
    />
  );
}
