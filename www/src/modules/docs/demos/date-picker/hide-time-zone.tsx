"use client";

import { DatePicker } from "@/components/dynamic-ui/date-picker";
import { parseZonedDateTime } from "@internationalized/date";

export default function Demo() {
  return (
    <DatePicker
      label="Appointment time"
      granularity="minute"
      defaultValue={parseZonedDateTime("2022-11-07T10:45[America/Los_Angeles]")}
      hideTimeZone
    />
  );
}
