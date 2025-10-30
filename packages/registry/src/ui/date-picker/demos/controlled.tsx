"use client";

import React from "react";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";

import { Calendar } from "@dotui/registry/ui/calendar";
import {
  DatePicker,
  DatePickerContent,
  DatePickerInput,
} from "@dotui/registry/ui/date-picker";
import { Label } from "@dotui/registry/ui/field";

export default function Demo() {
  const [value, setValue] = React.useState<DateValue | null>(
    parseDate("2020-02-03"),
  );
  return (
    <div className="flex flex-col items-center gap-4">
      <DatePicker value={value} onChange={setValue}>
        <Label>Meeting date</Label>
        <DatePickerInput />
        <DatePickerContent>
          <Calendar />
        </DatePickerContent>
      </DatePicker>
      <p className="text-sm text-fg-muted">
        selected date: {value?.toString()}
      </p>
    </div>
  );
}
