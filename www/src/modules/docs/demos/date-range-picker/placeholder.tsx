"use client";

import { DateRangePicker } from "@/components/dynamic-ui/date-range-picker";
import { CalendarDate } from "@internationalized/date";

export default function Demo() {
  return (
    <DateRangePicker
      label="Meeting date"
      placeholderValue={new CalendarDate(1980, 1, 1)}
    />
  );
}
