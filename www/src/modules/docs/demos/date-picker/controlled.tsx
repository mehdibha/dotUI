"use client";

import type { DateValue } from "react-aria-components";
import React from "react";
import { DatePicker } from "@/components/dynamic-ui/date-picker";
import { parseDate } from "@internationalized/date";

export default function Demo() {
  const [value, setValue] = React.useState<DateValue | null>(
    parseDate("2020-02-03"),
  );
  return (
    <div className="flex flex-col items-center gap-4">
      <DatePicker label="Meeting date" value={value} onChange={setValue} />
      <p className="text-fg-muted text-sm">
        selected date: {value?.toString()}
      </p>
    </div>
  );
}
