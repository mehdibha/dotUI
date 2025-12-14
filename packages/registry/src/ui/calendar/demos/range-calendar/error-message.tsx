"use client";

import React from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import type { DateRange } from "react-aria-components";

import {
  Calendar,
  CalendarGrid,
  CalendarHeader,
} from "@dotui/registry/ui/calendar";
import { FieldError } from "@dotui/registry/ui/field";

export default function Demo() {
  const [range, setRange] = React.useState<DateRange | null>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1, days: 3 }),
  });
  const isInvalid = range ? range.end.compare(range.start) > 7 : false;

  return (
    <Calendar
      mode="range"
      aria-label="Trip dates"
      value={range}
      onChange={setRange}
      isInvalid={isInvalid}
    >
      <CalendarHeader />
      <CalendarGrid />
      <FieldError>Maximum stay duration is 1 week</FieldError>
    </Calendar>
  );
}
