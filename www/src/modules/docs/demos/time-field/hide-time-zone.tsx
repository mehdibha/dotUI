"use client";

import { TimeField } from "@/components/dynamic-ui/time-field";
import { parseZonedDateTime } from "@internationalized/date";

export default function Demo() {
  return (
    <TimeField
      aria-label="Appointment time"
      defaultValue={parseZonedDateTime("2022-11-07T10:45[America/Los_Angeles]")}
      hideTimeZone
    />
  );
}
