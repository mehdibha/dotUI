"use client";

import { Description, Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";
import { TimeField } from "@dotui/registry/ui/time-field";

export default function Demo() {
  return (
    <TimeField>
      <Label>Appointment</Label>
      <DateInput />
      <Description>Please select a time between 9 AM and 5 PM.</Description>
    </TimeField>
  );
}
