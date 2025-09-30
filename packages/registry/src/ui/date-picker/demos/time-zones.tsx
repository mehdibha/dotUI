"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";

import { DatePicker } from "@dotui/registry/ui/date-picker";

export default function Demo() {
  return (
    <DatePicker
      aria-label="Date picker with time zones"
      defaultValue={parseAbsoluteToLocal("2021-11-07T07:45:00Z")}
    />
  );
}
