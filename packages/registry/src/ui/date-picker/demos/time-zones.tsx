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
      aria-label="Date picker with time zones"
      defaultValue={parseAbsoluteToLocal("2021-11-07T07:45:00Z")}
    >
      <DatePickerInput />
      <DatePickerContent>
        <Calendar />
      </DatePickerContent>
    </DatePicker>
  );
}
