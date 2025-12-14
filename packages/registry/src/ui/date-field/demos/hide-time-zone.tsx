"use client";

import { parseZonedDateTime } from "@internationalized/date";

import { DateField } from "@dotui/registry/ui/date-field";
import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";

export default function Demo() {
  return (
    <DateField
      granularity="minute"
      defaultValue={parseZonedDateTime("2022-11-07T10:45[America/Los_Angeles]")}
      hideTimeZone
      className="w-auto"
    >
      <Label>Appointment time</Label>
      <DateInput />
    </DateField>
  );
}
