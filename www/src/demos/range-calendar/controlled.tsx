"use client";

import React from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { type DateRange } from "react-aria-components";
import { RangeCalendar } from "@/components/dynamic-core/calendar";

export default function Demo() {
  const [range, setRange] = React.useState<DateRange | null>({
    start: today(getLocalTimeZone()),
    end: today(getLocalTimeZone()).add({ weeks: 1 }),
  });
  return (
    <div className="flex flex-col items-center gap-6">
      <RangeCalendar
        aria-label="Date (controlled)"
        value={range}
        onChange={setRange}
      />
      <p className="text-fg-muted text-sm">
        Start date: {range?.start.toString()}
        <br />
        End date: {range?.end.toString()}
      </p>
    </div>
  );
}
