"use client";

import React from "react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { type DateRange } from "react-aria-components";
import { RangeCalendar } from "@/components/dynamic-ui/calendar";

export default function Demo() {
  const [range, setRange] = React.useState<DateRange | null>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1, days: 3 }),
  });
  const isInvalid = range ? range.end.compare(range.start) > 7 : false;
  return (
    <RangeCalendar
      aria-label="Trip dates"
      value={range}
      onChange={setRange}
      isInvalid={isInvalid}
      errorMessage={isInvalid ? "Maximum stay duration is 1 week" : undefined}
    />
  );
}
