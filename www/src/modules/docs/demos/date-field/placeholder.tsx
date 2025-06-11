"use client";

import { DateField } from "@/components/dynamic-ui/date-field";
import { CalendarDate } from "@internationalized/date";

export default function Demo() {
  return (
    <DateField
      label="Meeting date"
      placeholderValue={new CalendarDate(1980, 1, 1)}
    />
  );
}
