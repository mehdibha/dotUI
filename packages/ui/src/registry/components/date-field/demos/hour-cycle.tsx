"use client";

import { DateField } from "@dotui/ui/components/date-field";

export default function Demo() {
  return (
    <DateField
      aria-label="Appointment date"
      granularity="minute"
      hourCycle={24}
      className="w-auto"
    />
  );
}
