"use client";

import React from "react";
import { parseDate } from "@internationalized/date";
import { DatePicker } from "@/components/dynamic-core/date-picker";

export default function Demo() {
  const [value, setValue] = React.useState(parseDate("2020-02-03"));
  return (
    <div className="flex flex-col items-center gap-4">
      <DatePicker label="Meeting date" value={value} onChange={setValue} />
      <p className="text-fg-muted text-sm">selected date: {value.toString()}</p>
    </div>
  );
}