"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";

import { Calendar } from "@dotui/registry/ui/calendar";
import {
  DatePicker,
  DatePickerContent,
  DatePickerInput,
} from "@dotui/registry/ui/date-picker";
import { Label } from "@dotui/registry/ui/field";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <DatePicker
        granularity="hour"
        defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}
      >
        <Label>Hour</Label>
        <DatePickerInput />
        <DatePickerContent>
          <Calendar />
        </DatePickerContent>
      </DatePicker>

      <DatePicker
        granularity="minute"
        defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}
      >
        <Label>Minute</Label>
        <DatePickerInput />
        <DatePickerContent>
          <Calendar />
        </DatePickerContent>
      </DatePicker>

      <DatePicker
        granularity="second"
        defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}
      >
        <Label>Second</Label>
        <DatePickerInput />
        <DatePickerContent>
          <Calendar />
        </DatePickerContent>
      </DatePicker>
    </div>
  );
}
