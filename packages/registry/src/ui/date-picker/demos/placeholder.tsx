"use client";

import { CalendarDate } from "@internationalized/date";

import { DatePicker } from "@dotui/registry/ui/date-picker";

export default function Demo() {
  return (
    <DatePicker
      label="Meeting date"
      placeholderValue={new CalendarDate(1980, 1, 1)}
    />
  );
}
