"use client";

import type { DateRange } from "react-aria-components";
import React from "react";
import { RangeCalendar } from "@/components/dynamic-ui/calendar";
import { parseDate } from "@internationalized/date";

export default function Demo() {
  const [value, setValue] = React.useState<DateRange>({
    start: parseDate("2020-02-03"),
    end: parseDate("2020-02-12"),
  });
  return (
    <div className="flex flex-col items-center gap-6">
      <RangeCalendar
        aria-label="Trip dates"
        value={value}
        onChange={setValue}
      />
      <p className="text-fg-muted text-sm">
        Start date: {value.start.toString()}
        <br />
        End date: {value.end.toString()}
      </p>
    </div>
  );
}
