"use client";

import { DateField } from "@/registry/ui/default/core/date-field";

export default function Demo() {
  return (
    <DateField
      aria-label="Appointment date"
      granularity="minute"
      hourCycle={24}
    />
  );
}
