"use client";

import React from "react";
import { parseDate } from "@internationalized/date";
import { DateRangePicker } from "@/lib/components/core/default/date-range-picker";

export default function Demo() {
  const [value, setValue] = React.useState({
    start: parseDate("2020-02-03"),
    end: parseDate("2020-02-08"),
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <DateRangePicker label="Controlled" value={value} onChange={setValue} />
      {/* TODO: FIX THIS */}
      <p className="text-sm text-fg-muted">selected date: {JSON.stringify(value)}</p>
    </div>
  );
}
