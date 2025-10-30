"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";

import { Calendar } from "@dotui/registry/ui/calendar";
import {
  DatePicker,
  DatePickerContent,
  DatePickerInput,
} from "@dotui/registry/ui/date-picker";

export default function Demo() {
  return (
    <DatePicker
      mode="range"
      aria-label="Date picker with time zones"
      defaultValue={{
        start: parseAbsoluteToLocal("2021-04-07T18:45:22Z"),
        end: parseAbsoluteToLocal("2021-04-08T20:00:00Z"),
      }}
    >
      <DatePickerInput />
      <DatePickerContent>
        <Calendar />
      </DatePickerContent>
    </DatePicker>
  );
}
