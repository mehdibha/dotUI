"use client";

import React from "react";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { useDateFormatter } from "react-aria";
import type { DateRange } from "react-aria-components";

import { Calendar } from "@dotui/registry/ui/calendar";
import {
  DatePicker,
  DatePickerContent,
  DatePickerInput,
} from "@dotui/registry/ui/date-picker";
import { Label } from "@dotui/registry/ui/field";

export default function Demo() {
  const [value, setValue] = React.useState<DateRange | null>({
    start: parseDate("2024-02-03"),
    end: parseDate("2024-02-08"),
  });
  const formatter = useDateFormatter({ dateStyle: "long" });

  return (
    <div className="flex flex-col items-center gap-4">
      <DatePicker mode="range" value={value} onChange={setValue}>
        <Label>Meeting date</Label>
        <DatePickerInput />
        <DatePickerContent>
          <Calendar />
        </DatePickerContent>
      </DatePicker>
      <p className="text-fg-muted text-sm">
        selected range:{" "}
        {value
          ? formatter.formatRange(
              value.start.toDate(getLocalTimeZone()),
              value.end.toDate(getLocalTimeZone()),
            )
          : "--"}
      </p>
    </div>
  );
}
