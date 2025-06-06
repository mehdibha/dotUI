"use client";

import { CalendarDate } from "@internationalized/date";
import { DateField } from "@/components/dynamic-ui/date-field";

export default function Demo() {
  return (
    <DateField
      label="Meeting date"
      placeholderValue={new CalendarDate(1980, 1, 1)}
    />
  );
}
