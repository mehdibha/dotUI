"use client";

import { DatePicker } from "@/components/dynamic-ui/date-picker";
import { CalendarDate } from "@internationalized/date";

export default function Demo() {
  return (
    <DatePicker
      label="Meeting date"
      placeholderValue={new CalendarDate(1980, 1, 1)}
    />
  );
}
