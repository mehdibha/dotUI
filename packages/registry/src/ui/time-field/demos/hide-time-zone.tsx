"use client";

import { parseZonedDateTime } from "@internationalized/date";

import { TimeField } from "@dotui/registry/ui/time-field";

export default function Demo() {
  return (
    <TimeField
      aria-label="Appointment time"
      defaultValue={parseZonedDateTime("2022-11-07T10:45[America/Los_Angeles]")}
      hideTimeZone
    />
  );
}
