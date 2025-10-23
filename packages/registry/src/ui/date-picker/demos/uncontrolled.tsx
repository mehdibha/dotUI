"use client";

import { parseDate } from "@internationalized/date";

import { DatePicker } from "@dotui/registry/ui/date-picker";

export default function Demo() {
  return (
    <DatePicker
      aria-label="Meeting date"
      defaultValue={parseDate("2020-02-03")}
    />
  );
}
