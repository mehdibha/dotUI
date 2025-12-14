"use client";

import { CalendarDate } from "@internationalized/date";

import { DateField } from "@dotui/registry/ui/date-field";
import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";

export default function Demo() {
  return (
    <DateField placeholderValue={new CalendarDate(1980, 1, 1)}>
      <Label>Meeting date</Label>
      <DateInput />
    </DateField>
  );
}
