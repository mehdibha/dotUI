"use client";

import type { DateRange } from "react-aria-components";
import React from "react";
import { DateRangePicker } from "@/components/dynamic-ui/date-range-picker";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import { useDateFormatter } from "react-aria";

export default function Demo() {
  const [value, setValue] = React.useState<DateRange | null>({
    start: parseDate("2024-02-03"),
    end: parseDate("2024-02-08"),
  });
  const formatter = useDateFormatter({ dateStyle: "long" });

  return (
    <div className="flex flex-col items-center gap-4">
      <DateRangePicker label="Controlled" value={value} onChange={setValue} />
      <p className="text-fg-muted text-sm">
        Selected date:{" "}
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
