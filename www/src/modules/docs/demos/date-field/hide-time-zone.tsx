"use client";

import { DateField } from "@/components/dynamic-ui/date-field";
import { parseZonedDateTime } from "@internationalized/date";

export default function Demo() {
  return (
    <DateField
      label="Appointment time"
      granularity="minute"
      defaultValue={parseZonedDateTime("2022-11-07T10:45[America/Los_Angeles]")}
      hideTimeZone
      className="w-auto"
    />
  );
}
