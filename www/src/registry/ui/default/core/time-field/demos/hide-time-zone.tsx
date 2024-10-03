"use client";

import { parseZonedDateTime } from "@internationalized/date";
import { TimeField } from "@/registry/ui/default/core/time-field";

export default function Demo() {
  return (
    <TimeField
      defaultValue={parseZonedDateTime("2022-11-07T10:45[America/Los_Angeles]")}
      hideTimeZone
    />
  );
}
